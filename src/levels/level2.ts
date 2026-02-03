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
  // Wave 1: Swarm Intro
  // Total Health: 800 (40 * 20) | Speed: 5 | Difficulty: ~1000
  { count: 40, interval: 400, type: E.SWARM },

  // Wave 2: Standard
  // Total Health: 2000 | Speed: 2 | Difficulty: ~2000
  { count: 20, interval: 1000, type: E.BASIC },

  // Wave 3: Heavy Armor
  // Total Health: 5000 | Speed: 1 | Difficulty: ~2500
  { count: 20, interval: 1500, type: E.HEAVY },

  // Wave 4: Speed Rush
  // Total Health: 2500 | Speed: 4 | Difficulty: ~4000
  { count: 50, interval: 500, type: E.FAST },

  // Wave 5: Double Boss
  // Total Health: 10000 | Speed: 0.5 | Difficulty: ~10000
  { count: 2, interval: 5000, type: E.BOSS },
];

const data: LevelData = {
  map,
  waves,
  startHealth: 20,
  startMoney: 800,
};

export default data;
