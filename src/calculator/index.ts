export function calculateDamage(
  weaponRaw: number,
  weaponEle: number,
  rawPercentageBonus: number,
  rawFlatBonus: number,
  elePercentageBonus: number,
  eleFlatBonus: number,
  affinityPercentage: number,
  critBoostLevel: number,
  critEleLevel: number,
  sharpness: keyof typeof sharpnessRawMultiplier,
  motionValue: number,
  hitzoneRaw: number,
  hitZoneEle: number
) {
  const raw =
    (weaponRaw * ((100 + rawPercentageBonus) / 100) + rawFlatBonus) *
    (hitzoneRaw / 100) *
    sharpnessRawMultiplier[sharpness] *
    (motionValue / 100)

  const ele =
    (weaponEle * ((100 + elePercentageBonus) / 100) + eleFlatBonus) *
    sharpnessElementalMultiplier[sharpness] *
    (hitZoneEle / 100)

  const nonCrit = raw + ele

  const isPositiveCrit = affinityPercentage >= 0
  const effectiveAffinity = Math.max(Math.abs(affinityPercentage), 100)

  const positiveCrit =
    raw * criticalBoostSkill[critBoostLevel] +
    ele * criticalElementSkill[critEleLevel]

  const negativeCrit = raw * 0.75 + ele

  const weightedCrit = isPositiveCrit
    ? positiveCrit * (effectiveAffinity / 100)
    : negativeCrit * (Math.abs(effectiveAffinity) / 100)

  const weightedNonCrit = (nonCrit * (100 - Math.abs(effectiveAffinity))) / 100

  const average = weightedCrit + weightedNonCrit

  return {
    crit: isPositiveCrit ? positiveCrit : negativeCrit,
    nonCrit,
    average,
  }
}

/** aB[rank] = [percentage, flat] */
export const attackBoostSkill = [
  [0, 0],
  [0, 3],
  [0, 6],
  [0, 9],
  [5, 7],
  [6, 8],
  [8, 9],
  [10, 10],
] as const

export const elementalAttackSkill = [
  [0, 0],
  [0, 2],
  [0, 3],
  [5, 4],
  [10, 4],
  [20, 4],
]

export type Sharpness = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'white'

export const sharpnessRawMultiplier = {
  white: 1.32,
  blue: 1.2,
  green: 1.05,
  yellow: 1,
  orange: 0.75,
  red: 0.5,
} as const

export const sharpnessElementalMultiplier: { [K in Sharpness]: number } = {
  white: 1.15,
  blue: 1.0625,
  green: 1,
  yellow: 0.75,
  orange: 0.5,
  red: 0.25,
} as const

export const criticalBoostSkill = [1.25, 1.3, 1.35, 1.4] as const

export const weaknessExploitSkill = [0, 15, 30, 50] as const

export const criticalElementSkill = [1, 1.05, 1.1, 1.15] as const

export const demondrug = {
  None: 0,
  Demondrug: 5,
  'Mega Demondrug': 7,
} as const

export const bludgeonerSkill: [Sharpness[], number][] = [
  [[], 0],
  [['yellow'], 5],
  [['yellow'], 10],
  [['yellow', 'green'], 10],
]
