import Game from "./Game";
import { WaveConfig, EnemyType } from "./types";

export default class WaveManager {
  game: Game;
  waves: WaveConfig[];
  currentWaveIndex: number;
  waveActive: boolean;
  spawnQueue: EnemyType[];
  spawnTimer: number;
  spawnInterval: number;

  constructor(game: Game) {
    this.game = game;
    this.waves = [];
    this.currentWaveIndex = -1;
    this.waveActive = false;
    this.spawnQueue = [];
    this.spawnTimer = 0;
    this.spawnInterval = 0;
  }

  init(wavesConfig: WaveConfig[]) {
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

    this.spawnInterval = wave.interval / 1000;
    this.spawnTimer = 0;
    this.waveActive = true;

    console.log(`Starting Wave ${this.currentWaveIndex + 1}:`, wave);

    return {
      current: this.currentWaveIndex + 1,
      total: this.waves.length,
    };
  }

  update(deltaTime: number) {
    if (!this.waveActive) return;

    if (this.spawnQueue.length > 0) {
      this.spawnTimer -= deltaTime;
      if (this.spawnTimer <= 0) {
        const type = this.spawnQueue.shift();
        if (type) {
          this.game.spawnEnemy(type);
          this.spawnTimer = this.spawnInterval;
        }
      }
    }
  }

  isSpawning(): boolean {
    return this.spawnQueue.length > 0;
  }

  isLastWave(): boolean {
    return this.currentWaveIndex >= this.waves.length - 1;
  }
}
