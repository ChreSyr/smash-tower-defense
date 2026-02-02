export const TILE_TYPE = {
  EMPTY: 0, // Nothing here
  BUILDABLE: 1, // Can place tower
  PATH: 2, // Enemy path
  OBSTACLE: 3, // Decor, cannot build
  START: 4, // Enemy spawn point
  END: 5, // Enemy destination
};

export const ENEMY_TYPE = {
  BASIC: "basic",
  FAST: "fast",
  HEAVY: "heavy",
  BOSS: "boss",
  SWARM: "swarm",
};

export const ENEMY_CONFIG = {
  [ENEMY_TYPE.BASIC]: {
    speed: 2,
    health: 100,
    color: "#e74c3c", // Red
    radius: 0.3,
    damage: 1, // Damage to player
  },
  [ENEMY_TYPE.FAST]: {
    speed: 4,
    health: 50,
    color: "#f39c12", // Orange
    radius: 0.25,
    damage: 1,
  },
  [ENEMY_TYPE.HEAVY]: {
    speed: 1,
    health: 300,
    color: "#8e44ad", // Purple
    radius: 0.4,
    damage: 3, // Heavy deals more damage
  },
  [ENEMY_TYPE.BOSS]: {
    speed: 0.5,
    health: 1000,
    color: "#2c3e50", // Dark Blue
    radius: 0.45,
    damage: 10, // Boss kills instantly (or lots of damage)
  },
  [ENEMY_TYPE.SWARM]: {
    speed: 5,
    health: 20,
    color: "#16a085", // Teal
    radius: 0.2,
    damage: 1,
  },
};
