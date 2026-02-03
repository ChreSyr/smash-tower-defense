import { TileType as T, EnemyType as E } from "../types";
import { LevelData } from "../types";

const map = [
  [
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.START,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
  ],
  [
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
  ],
  [
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
  ],
  [
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
  ],
  [
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
  ],
  [
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
  ],
  [
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
  ],
  [
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.END,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
  ],
];

const waves = [
  // Wave 1: Speed Rush - One leak and it's over
  { count: 10, interval: 800, type: E.FAST },

  // Wave 2: Swarm - High health total
  { count: 19, interval: 250, type: E.SWARM },

  // Wave 3: Heavy Wall
  { count: 12, interval: 1000, type: E.HEAVY },

  // Wave 4: Mixed Chaos
  { count: 20, interval: 100, type: E.BASIC },
  { count: 20, interval: 100, type: E.FAST },
  { count: 40, interval: 60, type: E.SWARM },

  // Wave 5: Ultimate Tank Challenge
  { count: 2, interval: 4000, type: E.TANK },
];

const data: LevelData = {
  map,
  waves,
  startHealth: 1, // Hardcore mode
  startMoney: 300,
};

export default data;
