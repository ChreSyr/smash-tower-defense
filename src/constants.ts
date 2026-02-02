import { EnemyType, EnemyConfig } from "./types";

export { TileType as TILE_TYPE } from "./types";
export { EnemyType as ENEMY_TYPE } from "./types";

import { EnemyType as E } from "./types";

export const ENEMY_CONFIG: Record<EnemyType, EnemyConfig> = {
  [E.BASIC]: {
    speed: 2,
    health: 100,
    color: "#e74c3c",
    radius: 0.3,
    damage: 1,
  },
  [E.FAST]: {
    speed: 4,
    health: 50,
    color: "#f39c12",
    radius: 0.25,
    damage: 1,
  },
  [E.HEAVY]: {
    speed: 1,
    health: 300,
    color: "#8e44ad",
    radius: 0.4,
    damage: 3,
  },
  [E.BOSS]: {
    speed: 0.5,
    health: 1000,
    color: "#2c3e50",
    radius: 0.45,
    damage: 10,
  },
  [E.SWARM]: {
    speed: 5,
    health: 20,
    color: "#16a085",
    radius: 0.2,
    damage: 1,
  },
};
