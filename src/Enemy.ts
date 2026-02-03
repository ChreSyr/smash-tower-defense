import { ENEMY_CONFIG } from "./constants";
import { EnemyType, EnemyConfig, PathNode, Point } from "./types";

export default class Enemy {
  type: EnemyType;
  config: EnemyConfig;
  path: PathNode[];
  pathIndex: number;
  x: number;
  y: number;
  target: Point | null;
  alive: boolean;
  reachedEnd: boolean;

  // Derived properties for easy access
  health: number;
  speed: number;
  color: string;
  radius: number;

  constructor(type: EnemyType, path: PathNode[]) {
    this.type = type;
    this.config = ENEMY_CONFIG[type] || ENEMY_CONFIG[EnemyType.BASIC];

    this.path = path;
    this.pathIndex = 0;

    if (path.length > 0) {
      this.x = path[0].col + 0.5;
      this.y = path[0].row + 0.5;
    } else {
      this.x = 0;
      this.y = 0;
    }

    this.target = null;
    this.alive = true;
    this.reachedEnd = false;

    this.updateTarget();

    this.health = this.config.health;
    this.speed = this.config.speed;
    this.color = this.config.color;
    this.radius = this.config.radius;
  }

  updateTarget() {
    if (this.pathIndex + 1 < this.path.length) {
      this.pathIndex++;
      this.target = {
        x: this.path[this.pathIndex].col + 0.5,
        y: this.path[this.pathIndex].row + 0.5,
      };
    } else {
      this.target = null;
      this.reachedEnd = true;
      this.alive = false;
    }
  }

  update(deltaTime: number) {
    if (!this.alive || !this.target) return;

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const moveStep = this.speed * deltaTime;

    if (distance <= moveStep) {
      this.x = this.target.x;
      this.y = this.target.y;
      this.updateTarget();
    } else {
      this.x += (dx / distance) * moveStep;
      this.y += (dy / distance) * moveStep;
    }
  }
  takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      this.alive = false;
    }
  }
}
