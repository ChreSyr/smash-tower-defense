import { EnemyType, EnemyConfig, TowerType, TowerConfig } from "./types";

export { TileType as TILE_TYPE } from "./types";
export { EnemyType as ENEMY_TYPE } from "./types";
export { TowerType as TOWER_TYPE } from "./types";

import { EnemyType as E, TowerType as T } from "./types";

export const ENEMY_CONFIG: Record<EnemyType, EnemyConfig> = {
  [E.BASIC]: {
    speed: 2,
    health: 60,
    color: "#ff0080", // Neon Pink
    radius: 0.3,
    damage: 1,
    killValue: 5,
  },
  [E.FAST]: {
    speed: 5,
    health: 60,
    color: "#f1c40f", // Neon Yellow
    radius: 0.25,
    damage: 1,
    killValue: 5,
  },
  [E.HEAVY]: {
    speed: 1,
    health: 250,
    color: "#a020f0", // Toxic Purple
    radius: 0.4,
    damage: 3,
    killValue: 25,
  },
  [E.SWARM]: {
    speed: 7,
    health: 26,
    color: "#00ffff", // Electric Cyan
    radius: 0.2,
    damage: 1,
    killValue: 4,
  },
  [E.TANK]: {
    speed: 0.5,
    health: 5000,
    color: "#e74c3c", // Tactical Red (Core)
    radius: 0.45,
    damage: 20,
    killValue: 5,
  },
};

export const TOWER_CONFIG: Record<TowerType, TowerConfig> = {
  // Good dps, good fire rate, good range
  [T.BASIC]: {
    name: "Standard",
    cost: 100,
    range: 3.5,
    damage: 25,
    fireRate: 2,
    color: "#3498db", // Tactical Blue
  },
  // Excellent dps, bad fire rate, excellent range
  [T.SNIPER]: {
    name: "Sniper MK1",
    cost: 300,
    range: 8,
    damage: 100,
    fireRate: 1,
    color: "#e74c3c", // Laser Red
  },
  // Good dps, excellent fire rate, bad range
  [T.RAPID]: {
    name: "Rapid Fire",
    cost: 150,
    range: 2.5,
    damage: 8,
    fireRate: 8,
    color: "#f39c12", // Electric Amber
  },
};

/**
 * TOWER BALANCING METHODOLOGY
 *
 * Key Metrics:
 * 1. DPS (Damage Per Second) = damage × fireRate
 * 2. Time in Range = (range × 2) / enemySpeed (assuming enemy crosses diameter)
 * 3. Total Damage Potential = DPS × Time in Range
 * 4. Cost Efficiency = Total Damage Potential / cost
 *
 * Balance Targets (vs Basic Enemy: 100 HP, 2 speed):
 * - Basic Tower: Should kill 1 Basic enemy in range (reference tower)
 * - Sniper: Long range, high damage, slow fire → kills tougher enemies
 * - Rapid: Short range, low damage, fast fire → kills swarms
 *
 * Calculations:
 * Basic: DPS=20, Range=3.5, Time=(3.5×2)/2=3.5s, Damage=70, Cost=100 → 0.7 dmg/$
 * Sniper: DPS=40, Range=8, Time=(8×2)/2=8s, Damage=320, Cost=300 → 1.07 dmg/$
 * Rapid: DPS=32, Range=2.5, Time=(2.5×2)/2=2.5s, Damage=80, Cost=150 → 0.53 dmg/$
 *
 * Balance Check:
 * - Cost efficiency should be within 0.5-1.5x of Basic tower
 * - Each tower should have a clear role (range/DPS/cost tradeoff)
 */

export function analyzeTowerBalance(towerType: TowerType): {
  dps: number;
  timeInRange: number; // vs Basic enemy (speed 2)
  totalDamage: number;
  costEfficiency: number;
  isBalanced: boolean;
  role: string;
} {
  const tower = TOWER_CONFIG[towerType];
  const basicEnemy = ENEMY_CONFIG[E.BASIC];

  const dps = tower.damage * tower.fireRate;
  const timeInRange = (tower.range * 2) / basicEnemy.speed;
  const totalDamage = dps * timeInRange;
  const costEfficiency = totalDamage / tower.cost;

  // Reference: Basic tower cost efficiency
  const basicTower = TOWER_CONFIG[T.BASIC];
  const basicDps = basicTower.damage * basicTower.fireRate;
  const basicTime = (basicTower.range * 2) / basicEnemy.speed;
  const basicEfficiency = (basicDps * basicTime) / basicTower.cost;

  // Balanced if within 50%-200% of basic efficiency
  const ratio = costEfficiency / basicEfficiency;
  const isBalanced = ratio >= 0.5 && ratio <= 2.0;

  // Determine role
  let role = "Unknown";
  if (tower.range > 5) role = "Long Range";
  else if (tower.fireRate > 5) role = "Anti-Swarm";
  else role = "Balanced";

  return {
    dps,
    timeInRange,
    totalDamage,
    costEfficiency,
    isBalanced,
    role,
  };
}

// Log balance analysis (for development)
if (typeof console !== "undefined") {
  console.log("=== TOWER BALANCE ANALYSIS ===");
  Object.values(TowerType).forEach((type) => {
    const analysis = analyzeTowerBalance(type as TowerType);
    console.log(`${type}:`, {
      DPS: analysis.dps.toFixed(1),
      TimeInRange: analysis.timeInRange.toFixed(2) + "s",
      TotalDamage: analysis.totalDamage.toFixed(1),
      CostEfficiency: analysis.costEfficiency.toFixed(3) + " dmg/$",
      Balanced: analysis.isBalanced ? "✓" : "✗",
      Role: analysis.role,
    });
  });
}
