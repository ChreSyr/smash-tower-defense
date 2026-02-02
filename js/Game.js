import UI from "./UI.js";
import WaveManager from "./WaveManager.js";
import Tower from "./Tower.js";
import GameMap from "./Map.js";
import Level1 from "./levels/level1.js";
import Level2 from "./levels/level2.js";
import Enemy from "./Enemy.js";

export default class Game {
  constructor() {
    this.ui = new UI();
    this.waveManager = new WaveManager(this);
    this.tower = new Tower();
    this.map = null;

    // Game State
    this.enemies = [];
    this.currentPath = [];
    this.playerHealth = 10;
    this.waveInProgress = false; // Add flag to track total wave state

    // Loop controls
    this.lastTime = 0;
    this.isPlaying = false;

    // Canvas for rendering entities
    this.canvas = null;
    this.ctx = null;

    // Bind loop
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

  startGame(levelData, title) {
    console.log(`Starting ${title}`);

    // Reset State
    this.playerHealth = levelData.startHealth || 10;
    this.ui.updateHealth(this.playerHealth);
    this.waveInProgress = false;
    this.ui.toggleWaveButton(true);

    // Load Level Data
    this.map = new GameMap(levelData.map);
    this.currentPath = this.map.findPath();

    if (this.currentPath.length === 0) {
      console.error("No path found for this level!");
    }

    this.waveManager.init(levelData.waves);
    this.enemies = [];
    this.isPlaying = true;

    // UI Updates
    this.ui.showGameScreen(title);

    // Render Map
    const mapContainer = document.getElementById("map-container");
    if (mapContainer) {
      this.map.render(mapContainer);
      this.setupCanvas(mapContainer);
    }

    this.ui.updateWaveStatus(0, levelData.waves.length);
  }

  setupCanvas(container) {
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

    // Check if a wave is already running
    if (this.waveInProgress) {
      console.log("Wave in progress, cannot start new one.");
      return;
    }

    const status = this.waveManager.startNextWave();
    if (status && status.current) {
      this.ui.updateWaveStatus(status.current, status.total);

      this.waveInProgress = true;
      this.ui.toggleWaveButton(false); // Disable button
    }
  }

  spawnEnemy(type) {
    if (!this.currentPath || this.currentPath.length === 0) return;
    const enemy = new Enemy(type, this.currentPath);
    this.enemies.push(enemy);
  }

  createTower() {
    this.tower.create();
  }

  gameLoop(timestamp) {
    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    if (this.isPlaying) {
      this.update(deltaTime);
      this.render();
    }

    requestAnimationFrame(this.gameLoop);
  }

  update(deltaTime) {
    if (this.playerHealth <= 0) return;

    this.waveManager.update(deltaTime);

    // Update enemies
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

    // Check end of wave
    if (this.waveInProgress) {
      // Wave ends when no enemies are spawning AND no enemies are alive
      if (!this.waveManager.isSpawning() && this.enemies.length === 0) {
        console.log("Wave Finished!");
        this.waveInProgress = false;
        this.ui.toggleWaveButton(true); // Re-enable button
      }
    }
  }

  takeDamage(amount) {
    this.playerHealth -= amount;
    if (this.playerHealth < 0) this.playerHealth = 0;

    this.ui.updateHealth(this.playerHealth);

    if (this.playerHealth <= 0) {
      console.log("GAME OVER");
      this.ui.updateHealth("GAME OVER");
      this.isPlaying = false;
      // Also ensure/disable things if needed
      this.ui.toggleWaveButton(false);
    }
  }

  render() {
    if (!this.ctx || !this.map) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const tileSize = this.canvas.width / this.map.cols;

    this.enemies.forEach((enemy) => {
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
