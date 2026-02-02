export enum TileType {
  EMPTY = 0,
  BUILDABLE = 1,
  PATH = 2,
  OBSTACLE = 3,
  START = 4,
  END = 5,
}

export enum EnemyType {
  BASIC = "basic",
  FAST = "fast",
  HEAVY = "heavy",
  BOSS = "boss",
  SWARM = "swarm",
}

export interface EnemyConfig {
  speed: number;
  health: number;
  color: string;
  radius: number;
  damage: number;
}

export interface WaveConfig {
  count: number;
  interval: number;
  type: EnemyType;
}

export interface LevelData {
  map: TileType[][];
  waves: WaveConfig[];
  startHealth: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface PathNode {
  col: number;
  row: number;
}
