import { TileType as T, EnemyType as E } from "../types";
import { LevelData } from "../types";

const map = [
  [
    T.OBSTACLE,
    T.START,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
  ],
  [
    T.OBSTACLE,
    T.PATH,
    T.OBSTACLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.OBSTACLE,
  ],
  [
    T.OBSTACLE,
    T.PATH,
    T.OBSTACLE,
    T.BUILDABLE,
    T.PATH,
    T.PATH,
    T.PATH,
    T.PATH,
    T.BUILDABLE,
    T.OBSTACLE,
  ],
  [
    T.OBSTACLE,
    T.PATH,
    T.PATH,
    T.PATH,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
    T.OBSTACLE,
  ],
  [
    T.OBSTACLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
    T.OBSTACLE,
  ],
  [
    T.OBSTACLE,
    T.BUILDABLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
    T.OBSTACLE,
  ],
  [
    T.OBSTACLE,
    T.BUILDABLE,
    T.PATH,
    T.PATH,
    T.PATH,
    T.PATH,
    T.PATH,
    T.PATH,
    T.BUILDABLE,
    T.OBSTACLE,
  ],
  [
    T.OBSTACLE,
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.OBSTACLE,
  ],
  [
    T.OBSTACLE,
    T.BUILDABLE,
    T.PATH,
    T.PATH,
    T.PATH,
    T.PATH,
    T.PATH,
    T.PATH,
    T.END,
    T.OBSTACLE,
  ],
  [
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
  ],
];

const waves = [
  // Total Health: 390 (15 * 26) | Speed: 7 | Difficulty: ~1365
  { count: 15, interval: 40, type: E.SWARM },

  // Total Health: 1200 | Speed: 2 | Difficulty: ~1200
  { count: 20, interval: 20, type: E.BASIC },

  // Total Health: 2500 | Speed: 5 | Difficulty: ~6250
  { count: 50, interval: 500, type: E.FAST },

  // Total Health: 10000 | Speed: 0.5 | Difficulty: ~2500
  { count: 2, interval: 5000, type: E.BOSS },
];

const data: LevelData = {
  map,
  waves,
  startHealth: 20,
  startMoney: 500,
};

export default data;
