import UI from "./UI";
import WaveManager from "./WaveManager";
import Tower from "./Tower";
import GameMap from "./Map";
import Level1 from "./levels/level1";
import Level2 from "./levels/level2";
import Level3 from "./levels/level3";
import Level4 from "./levels/level4";
import Level5 from "./levels/level5";
import Enemy from "./Enemy";
import {
  LevelData,
  PathNode,
  EnemyType,
  TowerType,
  Particle,
  TileType,
} from "./types";
import { TOWER_CONFIG } from "./constants";

export default class Game {
  ui: UI;
  waveManager: WaveManager;
  tower: Tower;
  map: GameMap | null;

  enemies: Enemy[];
  particles: Particle[];
  currentPath: PathNode[];
  playerHealth: number;
  money: number;
  waveInProgress: boolean;
  waveEnemiesKilledValue: number;
  totalGameTime: number; // For score calculation
  maxHealth: number; // For % calculation

  lastTime: number;
  isPlaying: boolean;
  speedMultiplier: number;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;

  // State
  selectedTowerType: TowerType | null = null;
  towers: Tower[] = [];
  hoverTileRow: number = -1;
  hoverTileCol: number = -1;

  // Current level tracking for restart
  currentLevelData: LevelData | null = null;
  currentLevelTitle: string = "";
  highScores: { [levelName: string]: number } = {}; // In-memory high scores

  constructor() {
    this.ui = new UI();
    this.waveManager = new WaveManager(this);
    this.tower = new Tower(TowerType.BASIC, 0, 0); // Placeholder
    this.map = null;

    this.enemies = [];
    this.particles = [];
    this.towers = [];
    this.currentPath = [];
    this.playerHealth = 10;
    this.money = 0;
    this.waveInProgress = false;
    this.waveEnemiesKilledValue = 0;
    this.totalGameTime = 0;
    this.maxHealth = 10;

    this.lastTime = 0;
    this.isPlaying = false;

    this.canvas = null;
    this.ctx = null;

    this.speedMultiplier = 1;

    this.gameLoop = this.gameLoop.bind(this);

    this.init();
  }

  init() {
    this.ui.onPlayLevel1(() => this.startGame(Level1, "Level 1"));
    this.ui.onPlayLevel2(() => this.startGame(Level2, "Level 2"));
    this.ui.onPlayLevel3(() => this.startGame(Level3, "Level 3"));
    this.ui.onPlayLevel4(() => this.startGame(Level4, "Level 4"));
    this.ui.onPlayLevel5(() => this.startGame(Level5, "Level 5"));
    this.ui.onHome(() => this.goHome());
    this.ui.onRestart(() => this.restartLevel());

    this.ui.onStartWave(() => this.startWave());

    this.ui.onSpeedChange((speed) => {
      this.speedMultiplier = speed;
      console.log(`Speed set to ${speed}x`);
    });

    // Handle Tower Selection
    this.ui.onTowerSelect((type: string) => {
      this.handleTowerSelect(type);
    });

    requestAnimationFrame(this.gameLoop);
  }

  startGame(levelData: LevelData, title: string) {
    console.log(`Starting ${title}`);

    // Store level data for restart
    this.currentLevelData = levelData;
    this.currentLevelTitle = title;

    this.maxHealth = levelData.startHealth || 10;
    this.playerHealth = this.maxHealth;
    this.money = levelData.startMoney || 100;
    this.totalGameTime = 0;
    this.ui.updateHealth(this.playerHealth);
    this.ui.updateMoney(this.money);
    this.ui.updateTowerAvailability(this.money);

    this.waveInProgress = false;
    this.waveEnemiesKilledValue = 0;
    this.ui.toggleWaveButton(true);

    this.towers = [];
    this.selectedTowerType = null;
    this.ui.highlightTower(null); // Clear selection UI

    this.map = new GameMap(levelData.map);
    this.currentPath = this.map.findPath();

    if (this.currentPath.length === 0) {
      console.error("No path found for this level!");
    }

    this.waveManager.init(levelData.waves);
    this.enemies = [];
    this.isPlaying = true;

    this.ui.showGameScreen(title);

    const mapContainer = document.getElementById("map-container");
    if (mapContainer && this.map) {
      // Create grid and get reference
      const gridElement = this.map.render(mapContainer);

      // Setup Canvas INSIDE the grid (so it overlays perfectly)
      this.setupCanvas(gridElement);
      this.setupMapInteraction(gridElement);

      // Setup Resizing Logic
      const triggerResize = () =>
        this.handleResize(mapContainer, gridElement, this.canvas!);

      triggerResize();
      setTimeout(triggerResize, 100);
      setTimeout(triggerResize, 500); // Failsafe

      // Keep reference for cleanup if needed, but usually one game instance per page load
      window.addEventListener("resize", triggerResize);
    }

    this.ui.updateWaveStatus(0, levelData.waves.length);
  }

  setupMapInteraction(gridElement: HTMLElement) {
    gridElement.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("tile")) {
        const row = parseInt(target.dataset.row || "-1");
        const col = parseInt(target.dataset.col || "-1");
        if (row >= 0 && col >= 0) {
          this.handleTileClick(row, col);
        }
      }
    });

    // Track hover for tower placement preview
    gridElement.addEventListener("mousemove", (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("tile")) {
        const row = parseInt(target.dataset.row || "-1");
        const col = parseInt(target.dataset.col || "-1");
        if (row >= 0 && col >= 0) {
          this.hoverTileRow = row;
          this.hoverTileCol = col;
        }
      } else {
        this.hoverTileRow = -1;
        this.hoverTileCol = -1;
      }
    });

    // Clear hover when mouse leaves
    gridElement.addEventListener("mouseleave", () => {
      this.hoverTileRow = -1;
      this.hoverTileCol = -1;
    });
  }

  handleTileClick(row: number, col: number) {
    if (!this.selectedTowerType) return;
    if (!this.canPlaceTower(this.selectedTowerType, col, row)) {
      return;
    }

    const config = TOWER_CONFIG[this.selectedTowerType];
    // Place Tower
    this.placeTower(this.selectedTowerType, col, row, config.cost);
  }

  /**
   * Safe check to see if a tower can be placed at a specific location
   */
  canPlaceTower(type: TowerType, col: number, row: number): boolean {
    if (!this.map) return false;

    // 1. Check bounds
    if (row < 0 || row >= this.map.rows || col < 0 || col >= this.map.cols)
      return false;

    // 2. Check if buildable
    const tileType = this.map.grid[row][col];
    if (tileType !== TileType.BUILDABLE) return false;

    // 3. Check if occupied
    const isOccupied = this.towers.some(
      (t) => Math.floor(t.y) === row && Math.floor(t.x) === col,
    );
    if (isOccupied) return false;

    // 4. Check cost
    const config = TOWER_CONFIG[type];
    if (this.money < config.cost) return false;

    return true;
  }

  placeTower(type: TowerType, x: number, y: number, cost: number) {
    if (this.money < cost) {
      console.error("Critical: Attempted to place tower without enough money");
      return;
    }

    this.money -= cost;
    this.ui.updateMoney(this.money);
    this.ui.updateTowerAvailability(this.money);

    const newTower = new Tower(type, x, y);
    this.towers.push(newTower);

    console.log(`Placed ${type} tower at ${x},${y}`);

    // Deselect tower after placement
    this.selectedTowerType = null;
    this.ui.highlightTower(null);
  }

  handleResize(
    container: HTMLElement,
    grid: HTMLElement,
    canvas: HTMLCanvasElement,
  ) {
    const rect = container.getBoundingClientRect();

    // If container is hidden or 0 size, we can't resize properly yet.
    if (rect.width === 0 || rect.height === 0) {
      // console.log("Container has 0 size, skipping resize");
      return;
    }

    // Calculate max square size that fits with some padding
    let size = Math.min(rect.width, rect.height) - 40; // 40px padding
    if (size < 0) size = 0;

    grid.style.width = `${size}px`;
    grid.style.height = `${size}px`;

    // Canvas needs explicit pixel size for resolution
    canvas.width = size;
    canvas.height = size;

    // Force redraw of map?
    // The grid is CSS grid, so it should reflow.
    // Canvas needs a render call?
    this.render();
  }

  setupCanvas(container: HTMLElement) {
    const oldCanvas = container.querySelector("canvas");
    if (oldCanvas) oldCanvas.remove();

    this.canvas = document.createElement("canvas");
    this.canvas.className = "game-canvas";

    // CSS size matches parent (grid)
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.pointerEvents = "none";

    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
  }

  restartLevel() {
    if (this.currentLevelData && this.currentLevelTitle) {
      console.log(`Restarting ${this.currentLevelTitle}`);
      this.startGame(this.currentLevelData, this.currentLevelTitle);
    }
  }

  goHome() {
    this.isPlaying = false;
    this.enemies = [];
    this.towers = [];
    this.ui.updateHighScores(this.highScores);
    this.ui.showHomeScreen();
  }

  startWave() {
    if (this.playerHealth <= 0) return;

    if (this.waveInProgress) {
      return;
    }

    const status = this.waveManager.startNextWave();
    if (status && status.current) {
      this.ui.updateWaveStatus(status.current, status.total);
      this.waveInProgress = true;
      this.waveEnemiesKilledValue = 0; // Reset for new wave
      this.ui.toggleWaveButton(false);
    }
  }

  handleTowerSelect(typeStr: string) {
    let type = TowerType.BASIC;
    if (typeStr === "sniper") type = TowerType.SNIPER;
    if (typeStr === "rapid") type = TowerType.RAPID;

    // Check affordability immediately for feedback?
    // Or just set state.
    this.selectedTowerType = type;
    this.ui.highlightTower(typeStr);

    const config = TOWER_CONFIG[type];
    if (this.money < config.cost) {
      console.log("Warning: Can't afford yet");
    }
  }

  spawnEnemy(type: EnemyType) {
    if (!this.currentPath || this.currentPath.length === 0) return;
    const enemy = new Enemy(type, this.currentPath);
    this.enemies.push(enemy);
  }

  gameLoop(timestamp: number) {
    const deltaTime =
      ((timestamp - this.lastTime) / 1000) * this.speedMultiplier;
    this.lastTime = timestamp;

    if (this.isPlaying) {
      this.update(deltaTime);
      this.render();
    }

    requestAnimationFrame(this.gameLoop);
  }

  update(deltaTime: number) {
    if (this.playerHealth <= 0) return;

    this.waveManager.update(deltaTime);

    if (this.waveInProgress) {
      this.totalGameTime += deltaTime;
    }

    // Update Towers
    this.towers.forEach((tower) => tower.update(deltaTime, this.enemies));

    // Filter dead enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(deltaTime);

      if (!enemy.alive) {
        this.enemies.splice(i, 1);

        // Handle Enemy Death/End
        if (enemy.reachedEnd) {
          this.takeDamage(enemy.config.damage || 1);
        } else {
          // Enemy Killed
          this.handleEnemyKill(enemy);
        }
      }
    }

    // Check wave completion ONLY if player is still alive
    if (this.waveInProgress && this.playerHealth > 0) {
      if (!this.waveManager.isSpawning() && this.enemies.length === 0) {
        this.endWave();
      }
    }

    // Update Particles
    this.particles.forEach((p) => {
      p.life -= deltaTime;
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
    });

    this.particles = this.particles.filter((p) => p.life > 0);
  }

  handleEnemyKill(enemy: Enemy) {
    const value = enemy.config.killValue || 0;
    this.money += value;
    this.waveEnemiesKilledValue += value;
    this.ui.updateMoney(this.money);
    this.ui.updateTowerAvailability(this.money);

    this.spawnDeathParticles(enemy);
  }

  spawnDeathParticles(enemy: Enemy) {
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1; // Speed in tiles/sec
      this.particles.push({
        x: enemy.x,
        y: enemy.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.5, // 0.5 seconds
        maxLife: 0.5,
        color: enemy.color,
        size: Math.random() * 0.1 + 0.05,
      });
    }
  }

  endWave() {
    console.log("Wave Finished!");
    this.waveInProgress = false;

    // Bonus: Quarter of all killed enemies value
    const bonus = Math.floor(this.waveEnemiesKilledValue * 0.25);
    if (bonus > 0) {
      console.log(`Wave Bonus: ${bonus}`);
      this.money += bonus;
      this.ui.updateMoney(this.money);
      this.ui.updateTowerAvailability(this.money);
    }

    // Check for Victory
    if (this.waveManager.isLastWave()) {
      console.log("VICTORY");
      this.isPlaying = false;
      const healthPercent = Math.round(
        (this.playerHealth / this.maxHealth) * 100,
      );
      const healthBonus = healthPercent * 50;
      const moneyBonus = this.money * 2;
      const timeFactor = Math.max(0, 10000 - this.totalGameTime * 50);
      const totalScore = Math.floor(healthBonus + moneyBonus + timeFactor);

      const previousHighScore = this.highScores[this.currentLevelTitle] || 0;
      const isNewHighScore = totalScore > previousHighScore;

      if (isNewHighScore) {
        this.highScores[this.currentLevelTitle] = totalScore;
      }

      this.ui.showVictoryScreen(
        () => this.goHome(),
        () => this.restartLevel(),
        {
          time: this.totalGameTime,
          healthPercent: healthPercent,
          money: this.money,
          totalScore: totalScore,
          isNewHighScore: isNewHighScore,
          previousHighScore: previousHighScore,
        },
      );
    } else {
      this.ui.toggleWaveButton(true);

      // Auto-Wave handling
      if (this.ui.isAutoWaveEnabled()) {
        setTimeout(() => {
          if (
            !this.waveInProgress &&
            this.isPlaying &&
            this.ui.isAutoWaveEnabled()
          ) {
            this.startWave();
          }
        }, 1000); // 1-second delay before next wave
      }
    }
  }

  takeDamage(amount: number) {
    this.playerHealth -= amount;
    if (this.playerHealth < 0) this.playerHealth = 0;

    this.ui.updateHealth(this.playerHealth);

    if (this.playerHealth <= 0) {
      console.log("GAME OVER");
      this.ui.updateHealth("GAME OVER");
      this.isPlaying = false;
      this.ui.toggleWaveButton(false);

      this.ui.showGameOverScreen(
        () => this.goHome(),
        () => this.restartLevel(),
      );
    }
  }

  render() {
    if (!this.ctx || !this.map || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const tileSize = this.canvas.width / this.map.cols;

    // Render Towers
    this.towers.forEach((tower) => {
      if (!this.ctx) return;
      const center = tower.getCenter(tileSize);

      this.ctx.beginPath();
      this.ctx.fillStyle = tower.config.color;
      // Draw square or circle for tower? Let's do a square with border
      const size = tileSize * 0.8;
      this.ctx.fillRect(center.x - size / 2, center.y - size / 2, size, size);

      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "rgba(52, 152, 219, 0.5)";
      this.ctx.strokeRect(center.x - size / 2, center.y - size / 2, size, size);

      // Helper range ring (optional, maybe only when selected or hovered?)
      // this.ctx.beginPath();
      // this.ctx.arc(center.x, center.y, tower.config.range * tileSize, 0, Math.PI*2);
      // this.ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      // this.ctx.stroke();

      // Draw Laser
      if (tower.target && tower.laserOpacity > 0) {
        const targetX = tower.target.x * tileSize;
        const targetY = tower.target.y * tileSize;

        // Laser Color based on tower type (lighter versions of tower colors)
        let color = "52, 152, 219"; // Tactical Blue (#3498db)
        let width = 6;

        if (tower.type === TowerType.SNIPER) {
          color = "231, 76, 60"; // Laser Red (#e74c3c)
          width = 10;
        } else if (tower.type === TowerType.RAPID) {
          color = "243, 156, 18"; // Electric Amber (#f39c12)
          width = 4;
        }

        // Layer 1: Outer Glow (widest, most transparent)
        this.ctx.beginPath();
        this.ctx.moveTo(center.x, center.y);
        this.ctx.lineTo(targetX, targetY);
        this.ctx.lineWidth = width * 4; // 4x width for outer glow
        this.ctx.strokeStyle = `rgba(${color}, ${tower.laserOpacity * 0.15})`;
        this.ctx.lineCap = "round";
        this.ctx.stroke();

        // Layer 2: Middle Glow (medium width, semi-transparent)
        this.ctx.beginPath();
        this.ctx.moveTo(center.x, center.y);
        this.ctx.lineTo(targetX, targetY);
        this.ctx.lineWidth = width * 2; // 2x width for middle glow
        this.ctx.strokeStyle = `rgba(${color}, ${tower.laserOpacity * 0.4})`;
        this.ctx.lineCap = "round";
        this.ctx.stroke();

        // Layer 3: Core Beam (bright and solid)
        this.ctx.beginPath();
        this.ctx.moveTo(center.x, center.y);
        this.ctx.lineTo(targetX, targetY);
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = `rgba(${color}, ${tower.laserOpacity})`;
        this.ctx.lineCap = "round";
        this.ctx.stroke();
        this.ctx.lineCap = "round";
        this.ctx.stroke();
      }
    });

    // Draw Placement Preview (Ghost Tower + Range Circle)
    if (
      this.selectedTowerType &&
      this.hoverTileRow >= 0 &&
      this.hoverTileCol >= 0 &&
      this.map
    ) {
      const config = TOWER_CONFIG[this.selectedTowerType];
      const centerX = (this.hoverTileCol + 0.5) * tileSize;
      const centerY = (this.hoverTileRow + 0.5) * tileSize;

      const isValid = this.canPlaceTower(
        this.selectedTowerType,
        this.hoverTileCol,
        this.hoverTileRow,
      );

      // Only show preview if placement is valid (buildable, not occupied, affordable)
      if (isValid) {
        // Draw Range Circle
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, config.range * tileSize, 0, Math.PI * 2);
        this.ctx.strokeStyle = "rgba(52, 152, 219, 0.5)";
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]); // Dashed line
        this.ctx.stroke();
        this.ctx.setLineDash([]); // Reset to solid

        // Fill range circle with subtle color
        this.ctx.fillStyle = "rgba(52, 152, 219, 0.05)";
        this.ctx.fill();

        // Draw Ghost Tower
        const size = tileSize * 0.8;
        this.ctx.fillStyle = config.color + "80"; // Add alpha for transparency (50%)
        this.ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);

        // Border for ghost tower
        this.ctx.strokeStyle = config.color + "CC"; // More opaque border
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(centerX - size / 2, centerY - size / 2, size, size);
      }
    }

    // Render Enemies
    this.enemies.forEach((enemy) => {
      if (!this.ctx) return;
      const cx = enemy.x * tileSize;
      const cy = enemy.y * tileSize;
      const radius = enemy.radius * tileSize;

      this.ctx.beginPath();
      this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = enemy.color;
      this.ctx.fill();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.stroke();

      // Draw Health Bar
      const healthBarWidth = radius * 2.5; // Slightly wider than enemy
      const healthBarHeight = 4;
      const healthBarX = cx - healthBarWidth / 2;
      const healthBarY = cy - radius - 8; // Above the enemy

      // Background (dark)
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      this.ctx.fillRect(
        healthBarX,
        healthBarY,
        healthBarWidth,
        healthBarHeight,
      );

      // Health fill
      const healthPercent = enemy.health / enemy.maxHealth;
      const healthWidth = healthBarWidth * healthPercent;

      this.ctx.fillStyle = "#e74c3c"; // Always red
      this.ctx.fillRect(healthBarX, healthBarY, healthWidth, healthBarHeight);

      // Border
      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(
        healthBarX,
        healthBarY,
        healthBarWidth,
        healthBarHeight,
      );
    });

    // Render Particles
    this.particles.forEach((p) => {
      if (!this.ctx) return;
      this.ctx.beginPath();
      this.ctx.globalAlpha = p.life / p.maxLife;
      this.ctx.fillStyle = p.color;
      const px = p.x * tileSize;
      const py = p.y * tileSize;
      const size = p.size * (p.life / p.maxLife) * tileSize;
      this.ctx.arc(px, py, size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalAlpha = 1.0;
    });
  }
}
