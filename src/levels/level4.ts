import { TileType as T, EnemyType as E } from "../types";
import { LevelData } from "../types";

// Design: 14x14 grid
// Path: Clockwise circle
// Start: (2, 9), End: (2, 6)
// Gap: (2, 7) and (2, 8) are BUILDABLE
// Center: Unbuildable Obstacles
const map = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13
  [
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
  ], // 0
  [
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
  ], // 1
  [
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.PATH,
    T.END,
    T.BUILDABLE,
    T.BUILDABLE,
    T.START,
    T.PATH,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
  ], // 2 (Gap at 6,7)
  [
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
  ], // 3
  [
    T.BUILDABLE,
    T.PATH,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.PATH,
    T.BUILDABLE,
  ], // 4
  [
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
  ], // 5
  [
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
  ], // 6
  [
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
  ], // 7
  [
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
  ], // 8
  [
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
  ], // 9
  [
    T.BUILDABLE,
    T.PATH,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.PATH,
    T.BUILDABLE,
  ], // 10
  [
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
  ], // 11
  [
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.PATH,
    T.PATH,
    T.PATH,
    T.PATH,
    T.PATH,
    T.PATH,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
  ], // 12
  [
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
  ], // 13
];

const waves = [
  // Total Health: 600 | Speed: 2 | Difficulty: ~600
  { count: 10, interval: 1200, type: E.BASIC },

  // Total Health: 500 | Speed: 5 | Difficulty: ~1250
  { count: 10, interval: 800, type: E.FAST },

  // Total Health: 1300 | Speed: 7 | Difficulty: ~4550
  { count: 50, interval: 200, type: E.SWARM },

  // Total Health: 1250 | Speed: 1 | Difficulty: ~625
  { count: 7, interval: 2000, type: E.HEAVY },

  // Total Health: 5000 | Speed: 0.5 | Difficulty: ~1250
  { count: 2, interval: 3000, type: E.TANK },
];

const data: LevelData = {
  map,
  waves,
  startHealth: 20,
  startMoney: 400,
};

export default data;
