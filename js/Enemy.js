import { ENEMY_CONFIG } from "./constants.js";

export default class Enemy {
  constructor(type, path) {
    this.type = type;
    this.config = ENEMY_CONFIG[type] || ENEMY_CONFIG["basic"];

    this.path = path; // Array of {col, row} points
    this.pathIndex = 0;

    // Start at middle of first tile
    if (path.length > 0) {
      this.x = path[0].col + 0.5; // Center of tile
      this.y = path[0].row + 0.5; // Center of tile
    } else {
      // Error case
      this.x = 0;
      this.y = 0;
    }

    this.target = null;
    this.updateTarget();

    this.health = this.config.health;
    this.speed = this.config.speed;
    this.color = this.config.color;
    this.radius = this.config.radius;

    this.alive = true;
    this.reachedEnd = false;
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

  update(deltaTime) {
    if (!this.alive || !this.target) return;

    // Move towards target
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Speed in tiles per second * delta time (seconds)
    const moveStep = this.speed * deltaTime;

    if (distance <= moveStep) {
      // Reached target (snap to it)
      this.x = this.target.x;
      this.y = this.target.y;
      this.updateTarget();
    } else {
      // Move partially
      this.x += (dx / distance) * moveStep;
      this.y += (dy / distance) * moveStep;
    }
  }
}
