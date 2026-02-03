import { EnemyType, EnemyConfig, TowerType, TowerConfig } from "./types";

export { TileType as TILE_TYPE } from "./types";
export { EnemyType as ENEMY_TYPE } from "./types";
export { TowerType as TOWER_TYPE } from "./types";

import { EnemyType as E, TowerType as T } from "./types";

export const ENEMY_CONFIG: Record<EnemyType, EnemyConfig> = {
  [E.BASIC]: {
    speed: 2,
    health: 60,
    color: "#e91e63", // Pink/Magenta (was red)
    radius: 0.3,
    damage: 1,
    killValue: 10,
  },
  [E.FAST]: {
    speed: 4,
    health: 50,
    color: "#ff9800", // Bright Orange (was orange)
    radius: 0.25,
    damage: 1,
    killValue: 20,
  },
  [E.HEAVY]: {
    speed: 1,
    health: 250,
    color: "#8e44ad",
    radius: 0.4,
    damage: 3,
    killValue: 50,
  },
  [E.BOSS]: {
    speed: 0.5,
    health: 5000, // 50x Basic
    color: "#2c3e50",
    radius: 0.45,
    damage: 10,
    killValue: 1000,
  },
  [E.SWARM]: {
    speed: 5,
    health: 25,
    color: "#16a085",
    radius: 0.2,
    damage: 1,
    killValue: 8, // Increased from 5
  },
};

export const TOWER_CONFIG: Record<TowerType, TowerConfig> = {
  [T.BASIC]: {
    name: "Basic",
    cost: 100,
    range: 3.5,
    damage: 20,
    fireRate: 1,
    color: "#2980b9",
  },
  [T.SNIPER]: {
    name: "Sniper",
    cost: 300,
    range: 8,
    damage: 100,
    fireRate: 0.4,
    color: "#c0392b",
  },
  [T.RAPID]: {
    name: "Rapid",
    cost: 150,
    range: 2.5,
    damage: 8,
    fireRate: 8,
    color: "#f39c12",
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
