import Enemy from "./Enemy.js";

export default class WaveManager {
  constructor(game) {
    this.game = game; // Reference to Game to add enemies
    this.waves = [];

    this.currentWaveIndex = -1;
    this.waveActive = false;

    this.spawnQueue = [];
    this.spawnTimer = 0;
    this.spawnInterval = 0;
  }

  init(wavesConfig) {
    this.waves = wavesConfig;
    this.currentWaveIndex = -1;
    this.spawnQueue = [];
    this.waveActive = false;
    console.log("Wave Manager Initialized");
  }

  startNextWave() {
    if (this.currentWaveIndex + 1 >= this.waves.length) {
      console.log("All waves complete!");
      return null;
    }

    this.currentWaveIndex++;
    const wave = this.waves[this.currentWaveIndex];

    this.spawnQueue = [];
    for (let i = 0; i < wave.count; i++) {
      this.spawnQueue.push(wave.type);
    }

    this.spawnInterval = wave.interval / 1000; // Convert ms to seconds
    this.spawnTimer = 0; // Spawn first enemy immediately
    this.waveActive = true;

    console.log(`Starting Wave ${this.currentWaveIndex + 1}:`, wave);

    return {
      current: this.currentWaveIndex + 1,
      total: this.waves.length,
    };
  }

  update(deltaTime) {
    if (!this.waveActive) return;

    if (this.spawnQueue.length > 0) {
      this.spawnTimer -= deltaTime;
      if (this.spawnTimer <= 0) {
        const type = this.spawnQueue.shift();
        this.game.spawnEnemy(type);
        this.spawnTimer = this.spawnInterval;
      }
    } else {
      // Queue empty, we can stop "spawning activity" logic if we want,
      // but for now we just keep waveActive true until manually reset or handled.
      // Actually, let's leave it.
    }
  }

  isSpawning() {
    return this.spawnQueue.length > 0;
  }
}
