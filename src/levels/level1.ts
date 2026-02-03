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
    T.OBSTACLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.BUILDABLE,
    T.OBSTACLE,
  ],
  [
    T.START,
    T.PATH,
    T.PATH,
    T.PATH,
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
    T.BUILDABLE,
    T.PATH,
    T.BUILDABLE,
    T.BUILDABLE,
    T.OBSTACLE,
    T.OBSTACLE,
    T.BUILDABLE,
    T.OBSTACLE,
  ],
  [
    T.OBSTACLE,
    T.BUILDABLE,
    T.BUILDABLE,
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
    T.OBSTACLE,
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
    T.OBSTACLE,
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
    T.OBSTACLE,
    T.END,
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
  // Total Health: 800 | Avg Speed: 2 | Difficulty: ~800
  { count: 3, interval: 2000, type: E.BASIC },

  // Total Health: 1250 | Avg Speed: 4 | Difficulty: ~2000 (Adjusted for speed)
  { count: 2, interval: 1000, type: E.FAST },

  // Total Health: 2500 | Avg Speed: 1 | Difficulty: ~2500
  { count: 1, interval: 2000, type: E.HEAVY },

  // Total Health: 2500 | Avg Speed: 1 | Difficulty: ~2500
  { count: 10, interval: 100, type: E.SWARM },

  // Total Health: 2500 | Avg Speed: 1 | Difficulty: ~2500
  { count: 9, interval: 500, type: E.BASIC },

  // Total Health: 2500 | Avg Speed: 1 | Difficulty: ~2500
  { count: 4, interval: 2000, type: E.HEAVY },

  // Total Health: 5000 | Speed: 0.5 | Difficulty: ~5000
  { count: 1, interval: 3000, type: E.BOSS },
];

// Helper to calculate difficulty (for dev reference)
// Difficulty = TotalHealth * (Speed / 2)
export function calculateDifficulty(wave: { count: number; type: E }) {
  // Config values manually tailored here for calculation context
  const stats: Record<string, { hp: number; spd: number }> = {
    basic: { hp: 100, spd: 2 },
    fast: { hp: 50, spd: 4 },
    heavy: { hp: 250, spd: 1 },
    boss: { hp: 5000, spd: 0.5 },
    swarm: { hp: 20, spd: 5 },
  };
  const s = stats[wave.type];
  if (!s) return 0;
  return wave.count * s.hp * (s.spd / 2); // Normalize speed to basic=1
}

const data: LevelData = {
  map,
  waves,
  startHealth: 10,
  startMoney: 250, // Enough for a few towers
};

export default data;
