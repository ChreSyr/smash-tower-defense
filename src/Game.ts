import UI from "./UI";
import WaveManager from "./WaveManager";
import Tower from "./Tower";
import GameMap from "./Map";
import Level1 from "./levels/level1";
import Level2 from "./levels/level2";
import Enemy from "./Enemy";
import { LevelData, PathNode, EnemyType, TowerType, Particle } from "./types";
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
  waveEnemiesKilledValue: number; // To track value for wave end bonus

  lastTime: number;
  isPlaying: boolean;
  speedMultiplier: number;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;

  // State
  selectedTowerType: TowerType | null = null;
  towers: Tower[] = [];

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
    this.ui.onHome(() => this.goHome());

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

    this.playerHealth = levelData.startHealth || 10;
    this.money = levelData.startMoney || 100;
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
  }

  handleTileClick(row: number, col: number) {
    if (!this.selectedTowerType) return;
    if (!this.map) return;

    const tileType = this.map.grid[row][col];

    // 1. Check if buildable
    if (tileType !== 1) {
      // 1 is BUILDABLE in enum, waiting for proper import usage or check types.ts
      // Actually let's use the enum if we can, or just assume logic for now.
      // tileType from map.grid is number (enum).
      // Enum: EMPTY=0, BUILDABLE=1
      console.log("Not a buildable tile");
      return;
    }

    // 2. Check if occupied
    const occupied = this.towers.find((t) => t.y === row && t.x === col);
    if (occupied) {
      console.log("Tile occupied");
      return;
    }

    // 3. Check cost
    const config = TOWER_CONFIG[this.selectedTowerType];
    if (this.money < config.cost) {
      console.log("Not enough money");
      return;
    }

    // Place Tower
    this.placeTower(this.selectedTowerType, col, row, config.cost);
  }

  placeTower(type: TowerType, x: number, y: number, cost: number) {
    this.money -= cost;
    this.ui.updateMoney(this.money);
    this.ui.updateTowerAvailability(this.money);

    const newTower = new Tower(type, x, y);
    this.towers.push(newTower);

    console.log(`Placed ${type} tower at ${x},${y}`);

    // Deselect logic? Optional. Let's keep selected for multi-build?
    // User requirement specifically said "Select a tower then click", didn't specify auto-deselect.
    // Usually keeping it selected is nicer.
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

  goHome() {
    this.isPlaying = false;
    this.enemies = [];
    this.towers = [];
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

    if (this.waveInProgress) {
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
      this.ui.showVictoryScreen(() => this.goHome());
    } else {
      this.ui.toggleWaveButton(true);
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

      this.ui.showGameOverScreen(() => this.goHome());
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

      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "#333";
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

        // Laser Color based on tower type
        let color = "52, 152, 219"; // Blue default
        let width = 4;

        if (tower.type === TowerType.SNIPER) {
          color = "231, 76, 60"; // Red
          width = 6;
        } else if (tower.type === TowerType.RAPID) {
          color = "241, 196, 15"; // Yellow
          width = 3;
        }

        // Draw Glow (Outer line)
        this.ctx.beginPath();
        this.ctx.moveTo(center.x, center.y);
        this.ctx.lineTo(targetX, targetY);
        this.ctx.lineWidth = width * 3; // 3x width for glow
        this.ctx.strokeStyle = `rgba(${color}, ${tower.laserOpacity * 0.3})`;
        this.ctx.lineCap = "round";
        this.ctx.stroke();

        // Draw Core (Inner line)
        this.ctx.beginPath();
        this.ctx.moveTo(center.x, center.y);
        this.ctx.lineTo(targetX, targetY);
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = `rgba(${color}, ${tower.laserOpacity})`;
        this.ctx.lineCap = "round";
        this.ctx.stroke();
      }
    });

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
