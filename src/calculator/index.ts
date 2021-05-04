export function calculateEffectiveRaw(
  weaponRaw: number,
  rawPercentageBonus: number,
  rawFlatBonus: number
) {
  return Math.floor(
    weaponRaw * ((100 + rawPercentageBonus) / 100) + rawFlatBonus
  )
}

export function calculateEffectiveElemental(
  weaponEle: number,
  elePercentageBonus: number,
  eleFlatBonus: number
) {
  return Math.floor(
    weaponEle * ((100 + elePercentageBonus) / 100) + eleFlatBonus
  )
}

export function calculateDamage(
  effectiveRaw: number,
  effectiveElemental: number,
  affinity: number,
  sharpness: keyof typeof sharpnessRawMultiplier,
  critBoostLevel: number,
  critEleLevel: number,
  motionValue: number,
  hitzoneRaw: number,
  hitZoneEle: number
) {
  const raw =
    effectiveRaw *
    (hitzoneRaw / 100) *
    (motionValue / 100) *
    sharpnessRawMultiplier[sharpness]

  const rawCrit = raw * criticalBoostSkill[critBoostLevel]

  const ele =
    effectiveElemental *
    (hitZoneEle / 100) *
    sharpnessElementalMultiplier[sharpness]

  const eleCrit = ele * criticalElementSkill[critEleLevel]

  const nonCrit = raw + ele

  const isPositiveCrit = affinity >= 0

  const positiveCrit = rawCrit + eleCrit

  const negativeCrit = raw * 0.75 + ele

  const weightedCrit = isPositiveCrit
    ? positiveCrit * (affinity / 100)
    : negativeCrit * (Math.abs(affinity) / 100)

  const weightedNonCrit = (nonCrit * (100 - Math.abs(affinity))) / 100

  const average = weightedCrit + weightedNonCrit

  return {
    crit: isPositiveCrit ? positiveCrit : negativeCrit,
    nonCrit,
    average,
    raw,
    ele,
    rawCrit: isPositiveCrit ? rawCrit : raw * 0.75,
    eleCrit,
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

export const criticalEyeSkill = [0, 5, 10, 15, 20, 25, 30, 40]

/** percentage, flat */
export const elementalAttackSkill = [
  [0, 0],
  [0, 2],
  [0, 3],
  [5, 4],
  [10, 4],
  [20, 4],
]

export type Sharpness =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'white'
  | 'ranged'

export const sharpnessRawMultiplier = {
  white: 1.32,
  blue: 1.2,
  green: 1.05,
  yellow: 1,
  orange: 0.75,
  red: 0.5,
  ranged: 1,
} as const

export const sharpnessElementalMultiplier: { [K in Sharpness]: number } = {
  white: 1.15,
  blue: 1.0625,
  green: 1,
  yellow: 0.75,
  orange: 0.5,
  red: 0.25,
  ranged: 1,
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
