import { TowerType, TowerConfig } from "./types";
import { TOWER_CONFIG } from "./constants";
import Enemy from "./Enemy";

export default class Tower {
  x: number;
  y: number; // Grid coordinates
  type: TowerType;
  config: TowerConfig;

  // Cooldown management
  lastShotTime: number;
  cooldown: number; // in seconds

  // Visuals
  target: Enemy | null = null; // Current target for laser
  laserOpacity: number = 0; // For fading laser effect

  constructor(type: TowerType, x: number, y: number) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.config = TOWER_CONFIG[type];

    this.lastShotTime = 0;
    this.cooldown = 1 / this.config.fireRate;
  }

  update(deltaTime: number, enemies: Enemy[]) {
    // 1. Cooldown
    if (this.lastShotTime > 0) {
      this.lastShotTime -= deltaTime;
    }

    // Decay laser visual if any
    if (this.laserOpacity > 0) {
      this.laserOpacity -= deltaTime * 5; // Fade out speed
      if (this.laserOpacity < 0) this.laserOpacity = 0;
    }

    // 2. Find Target if ready
    if (this.lastShotTime <= 0) {
      const target = this.findTarget(enemies);
      if (target) {
        this.shoot(target);
      }
    }
  }

  findTarget(enemies: Enemy[]): Enemy | null {
    // Target enemy with lowest health in range
    let target: Enemy | null = null;
    let minHealth = Infinity;

    // Range is in grid units. Config.range e.g. 3.
    const rangeSq = this.config.range * this.config.range;

    for (const enemy of enemies) {
      if (!enemy.alive) continue;

      // Enemy x,y are grid coordinates (float usually)
      const dx = enemy.x - (this.x + 0.5); // Center to Center
      const dy = enemy.y - (this.y + 0.5);

      const distSq = dx * dx + dy * dy;

      if (distSq <= rangeSq) {
        // Prioritize lowest health
        if (enemy.health < minHealth) {
          minHealth = enemy.health;
          target = enemy;
        }
      }
    }

    return target;
  }

  shoot(enemy: Enemy) {
    enemy.takeDamage(this.config.damage);
    this.lastShotTime = this.cooldown;

    // Visual
    this.target = enemy;
    this.laserOpacity = 1;
  }

  // Helper to get render position
  getCenter(tileSize: number) {
    return {
      x: (this.x + 0.5) * tileSize,
      y: (this.y + 0.5) * tileSize,
    };
  }
}
