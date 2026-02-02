import UI from "./UI";
import WaveManager from "./WaveManager";
import Tower from "./Tower";
import GameMap from "./Map";
import Level1 from "./levels/level1"; // We need to update levels too
import Level2 from "./levels/level2";
import Enemy from "./Enemy";
import { LevelData, PathNode, EnemyType } from "./types";

export default class Game {
  ui: UI;
  waveManager: WaveManager;
  tower: Tower;
  map: GameMap | null;

  enemies: Enemy[];
  currentPath: PathNode[];
  playerHealth: number;
  waveInProgress: boolean;

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
    this.waveInProgress = false;

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
    this.ui.onTowerCreate(() => this.createTower());

    requestAnimationFrame(this.gameLoop);
  }

  startGame(levelData: LevelData, title: string) {
    console.log(`Starting ${title}`);

    this.playerHealth = levelData.startHealth || 10;
    this.ui.updateHealth(this.playerHealth);
    this.waveInProgress = false;
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
    if (mapContainer) {
      this.map.render(mapContainer);
      this.setupCanvas(mapContainer);
    }

    this.ui.updateWaveStatus(0, levelData.waves.length);
  }

  setupCanvas(container: HTMLElement) {
    const oldCanvas = container.querySelector("canvas");
    if (oldCanvas) oldCanvas.remove();

    this.canvas = document.createElement("canvas");
    this.canvas.className = "game-canvas";

    const rect = container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";

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
      console.log("Wave in progress, cannot start new one.");
      return;
    }

    const status = this.waveManager.startNextWave();
    if (status && status.current) {
      this.ui.updateWaveStatus(status.current, status.total);
      this.waveInProgress = true;
      this.ui.toggleWaveButton(false);
    }
  }

  spawnEnemy(type: EnemyType) {
    if (!this.currentPath || this.currentPath.length === 0) return;
    const enemy = new Enemy(type, this.currentPath);
    this.enemies.push(enemy);
  }

  createTower() {
    this.tower.create();
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

        if (enemy.reachedEnd) {
          this.takeDamage(enemy.config.damage || 1);
        }
      }
    }

    if (this.waveInProgress) {
      if (!this.waveManager.isSpawning() && this.enemies.length === 0) {
        console.log("Wave Finished!");
        this.waveInProgress = false;
        this.ui.toggleWaveButton(true);
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
