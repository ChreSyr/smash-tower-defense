import { TileType as T, EnemyType as E } from "../types";
import { LevelData } from "../types";

const map = [
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
  [
    T.START,
    T.PATH,
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
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.END,
    T.OBSTACLE,
    T.OBSTACLE,
  ],
];

const waves = [
  // Total Health: 300 | Speed: 2 | Difficulty: ~300
  { count: 5, interval: 1500, type: E.BASIC },

  // Total Health: 250 | Speed: 5 | Difficulty: ~625
  { count: 5, interval: 800, type: E.FAST },

  // Total Health: 520 | Speed: 7 | Difficulty: ~1820
  { count: 20, interval: 300, type: E.SWARM },

  // Total Health: 750 | Speed: 1 | Difficulty: ~375
  { count: 3, interval: 2500, type: E.HEAVY },

  // Total Health: 5000 | Speed: 0.5 | Difficulty: ~1250
  { count: 1, interval: 3000, type: E.TANK },
];

const data: LevelData = {
  map,
  waves,
  startHealth: 15,
  startMoney: 400,
};

export default data;
