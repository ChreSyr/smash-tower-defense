import { EnemyType, EnemyConfig, TowerType, TowerConfig } from "./types";

export { TileType as TILE_TYPE } from "./types";
export { EnemyType as ENEMY_TYPE } from "./types";
export { TowerType as TOWER_TYPE } from "./types";

import { EnemyType as E, TowerType as T } from "./types";

export const ENEMY_CONFIG: Record<EnemyType, EnemyConfig> = {
  [E.BASIC]: {
    speed: 2,
    health: 100,
    color: "#e74c3c",
    radius: 0.3,
    damage: 1,
    killValue: 15, // Increased from 10
  },
  [E.FAST]: {
    speed: 4,
    health: 50,
    color: "#f39c12",
    radius: 0.25,
    damage: 1,
    killValue: 20, // Increased from 15
  },
  [E.HEAVY]: {
    speed: 1,
    health: 250, // Decreased from 300
    color: "#8e44ad",
    radius: 0.4,
    damage: 3,
    killValue: 50, // Increased from 30
  },
  [E.BOSS]: {
    speed: 0.5,
    health: 1000,
    color: "#2c3e50",
    radius: 0.45,
    damage: 10,
    killValue: 300, // Increased from 200
  },
  [E.SWARM]: {
    speed: 5,
    health: 20,
    color: "#16a085",
    radius: 0.2,
    damage: 1,
    killValue: 8, // Increased from 5
  },
};

export const TOWER_CONFIG: Record<TowerType, TowerConfig> = {
  [T.BASIC]: {
    name: "Basic",
    cost: 100,
    range: 3.5, // Buffer range
    damage: 20, // Buffed from 10
    fireRate: 1,
    color: "#3498db",
  },
  [T.SNIPER]: {
    name: "Sniper",
    cost: 300,
    range: 8, // Buffed from 7
    damage: 100, // Buffed from 50 (One shot kills basic)
    fireRate: 0.4, // Buffed from 0.3
    color: "#2ecc71",
  },
  [T.RAPID]: {
    name: "Rapid",
    cost: 250,
    range: 2.5,
    damage: 4,
    fireRate: 8, // Very fast
    color: "#f1c40f",
  },
};
