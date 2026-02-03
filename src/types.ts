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
  TANK = "TANK",
  SWARM = "swarm",
}

export enum TowerType {
  BASIC = "basic",
  SNIPER = "sniper",
  RAPID = "rapid",
}

export interface EnemyConfig {
  speed: number;
  health: number;
  color: string;
  radius: number;
  damage: number;
  killValue: number;
}

export interface TowerConfig {
  name: string;
  cost: number;
  range: number;
  damage: number;
  fireRate: number; // Shots per second
  color: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
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
  startMoney: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface PathNode {
  col: number;
  row: number;
}
