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
  // Wave 1: Intro
  // Total Health: 800 | Avg Speed: 2 | Difficulty: ~800
  { count: 8, interval: 1500, type: E.BASIC },

  // Wave 2: Ramp up
  // Total Health: 1500 | Avg Speed: 2 | Difficulty: ~1500
  { count: 15, interval: 1000, type: E.BASIC },

  // Wave 3: Speed test
  // Total Health: 1250 | Avg Speed: 4 | Difficulty: ~2000 (Adjusted for speed)
  { count: 25, interval: 800, type: E.FAST },

  // Wave 4: Tank test
  // Total Health: 2500 | Avg Speed: 1 | Difficulty: ~2500
  { count: 10, interval: 2000, type: E.HEAVY },

  // Wave 5: Swarm
  // Total Health: 2000 (100 * 20) | Avg Speed: 5 | Difficulty: ~3000
  { count: 100, interval: 300, type: E.SWARM },

  // Wave 6: BOSS
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
  startMoney: 500, // Enough for a few towers
};

export default data;
