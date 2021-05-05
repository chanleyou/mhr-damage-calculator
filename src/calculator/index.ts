function percentage(n: number) {
  return n / 100
}

function mPercentage(n: number) {
  return percentage(100 + n)
}

export function calculateUIRaw(
  weaponRaw: number,
  attackBoostFlat: number,
  attackBoostPercentage: number,
  bludgeoner: number,
  rawModifierPercentage: number,
  rawFlatBonus: number
) {
  return Math.floor(
    weaponRaw *
      mPercentage(attackBoostPercentage) *
      mPercentage(bludgeoner) *
      mPercentage(rawModifierPercentage) +
      attackBoostFlat +
      rawFlatBonus +
      0.1
  )
}

export function calculateUIElement(
  weaponEle: number,
  elePercentageBonus: number,
  eleFlatBonus: number
) {
  return Math.floor(weaponEle * mPercentage(elePercentageBonus) + eleFlatBonus)
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
    percentage(hitzoneRaw) *
    percentage(motionValue) *
    sharpnessRawMultiplier[sharpness]

  const rawCrit = raw * criticalBoostSkill[critBoostLevel]

  const ele =
    effectiveElemental *
    percentage(hitZoneEle) *
    sharpnessElementalMultiplier[sharpness]

  const eleCrit = ele * criticalElementSkill[critEleLevel]

  const nonCrit = Math.round(raw) + Math.round(ele)

  const isPositiveCrit = affinity >= 0
  const absoluteAffinity = Math.abs(affinity)

  const positiveCrit = Math.round(rawCrit) + Math.round(eleCrit)

  const negativeCrit = Math.round(raw * 0.75) + Math.round(ele)

  const weightedCrit =
    absoluteAffinity * percentage(isPositiveCrit ? positiveCrit : negativeCrit)

  const weightedNonCrit = percentage(100 - absoluteAffinity) * nonCrit

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
