import UI from "./UI";
import WaveManager from "./WaveManager";
import Tower from "./Tower";
import GameMap from "./Map";
import Level1 from "./levels/level1";
import Level2 from "./levels/level2";
import Enemy from "./Enemy";
import { LevelData, PathNode, EnemyType, TowerType } from "./types";
import { TOWER_CONFIG } from "./constants";

export default class Game {
  ui: UI;
  waveManager: WaveManager;
  tower: Tower;
  map: GameMap | null;

  enemies: Enemy[];
  currentPath: PathNode[];
  playerHealth: number;
  money: number;
  waveInProgress: boolean;
  waveEnemiesKilledValue: number; // To track value for wave end bonus

  lastTime: number;
  isPlaying: boolean;

  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;

  constructor() {
    this.ui = new UI();
    this.waveManager = new WaveManager(this);
    this.tower = new Tower();
    this.map = null;

    this.enemies = [];
    this.currentPath = [];
    this.playerHealth = 10;
    this.money = 0;
    this.waveInProgress = false;
    this.waveEnemiesKilledValue = 0;

    this.lastTime = 0;
    this.isPlaying = false;

    this.canvas = null;
    this.ctx = null;

    this.gameLoop = this.gameLoop.bind(this);

    this.init();
  }

  init() {
    this.ui.onPlayLevel1(() => this.startGame(Level1, "Level 1"));
    this.ui.onPlayLevel2(() => this.startGame(Level2, "Level 2"));
    this.ui.onHome(() => this.goHome());

    this.ui.onStartWave(() => this.startWave());

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

    this.waveInProgress = false;
    this.waveEnemiesKilledValue = 0;
    this.ui.toggleWaveButton(true);

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

      // Setup Resizing Logic
      this.handleResize(mapContainer, gridElement, this.canvas!);

      // Keep reference for cleanup if needed, but usually one game instance per page load
      window.addEventListener("resize", () =>
        this.handleResize(mapContainer, gridElement, this.canvas!),
      );
    }

    this.ui.updateWaveStatus(0, levelData.waves.length);
  }

  handleResize(
    container: HTMLElement,
    grid: HTMLElement,
    canvas: HTMLCanvasElement,
  ) {
    const rect = container.getBoundingClientRect();
    // Calculate max square size that fits with some padding
    const size = Math.min(rect.width, rect.height) - 20;

    grid.style.width = `${size}px`;
    grid.style.height = `${size}px`;

    canvas.width = size;
    canvas.height = size;
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
    // Just logic stub for now
    let type = TowerType.BASIC;
    if (typeStr === "sniper") type = TowerType.SNIPER;
    if (typeStr === "rapid") type = TowerType.RAPID;

    const config = TOWER_CONFIG[type];
    if (this.money >= config.cost) {
      console.log(`Selected ${config.name} tower. Cost: ${config.cost}`);
      // In future: set placement mode
    } else {
      console.log("Not enough money!");
    }
  }

  spawnEnemy(type: EnemyType) {
    if (!this.currentPath || this.currentPath.length === 0) return;
    const enemy = new Enemy(type, this.currentPath);
    this.enemies.push(enemy);
  }

  gameLoop(timestamp: number) {
    const deltaTime = (timestamp - this.lastTime) / 1000;
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
  }

  handleEnemyKill(enemy: Enemy) {
    const value = enemy.config.killValue || 0;
    this.money += value;
    this.waveEnemiesKilledValue += value;
    this.ui.updateMoney(this.money);
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
    }

    this.ui.toggleWaveButton(true);
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
    }
  }

  render() {
    if (!this.ctx || !this.map || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const tileSize = this.canvas.width / this.map.cols;

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
  }
}
