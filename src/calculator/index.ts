export function calculateDamage(
  weaponRaw: number,
  weaponEle: number,
  rawPercentageBonus: number,
  rawFlatBonus: number,
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
    weaponEle * sharpnessElementalMultiplier[sharpness] * (hitZoneEle / 100)

  const nonCrit = raw + ele

  const crit =
    raw * criticalBoost[critBoostLevel] + ele * criticalElement[critEleLevel]

  const weightedCrit = crit * (affinityPercentage / 100)
  const weightedNonCrit = (nonCrit * (100 - affinityPercentage)) / 100

  const average = weightedCrit + weightedNonCrit

  return {
    crit,
    nonCrit,
    average,
  }
}

/** aB[rank] = [percentage, flat] */
export const attackBoost = [
  [0, 0],
  [0, 3],
  [0, 6],
  [0, 9],
  [5, 7],
  [6, 8],
  [8, 9],
  [10, 10],
] as const

export const sharpnessRawMultiplier = {
  White: 1.32,
  Blue: 1.2,
  Green: 1.05,
  Yellow: 1,
  Orange: 0.75,
  Red: 0.5,
} as const

export const sharpnessElementalMultiplier = {
  White: 1.15,
  Blue: 1.0625,
  Green: 1,
  Yellow: 0.75,
  Orange: 0.5,
  Red: 0.25,
} as const

export const criticalBoost = [1.25, 1.3, 1.35, 1.4] as const

export const weaknessExploit = [0, 15, 30, 50] as const

export const criticalElement = [1, 1.05, 1.1, 1.15] as const

export const demondrug = {
  None: 0,
  Demondrug: 5,
  'Mega Demondrug': 7,
} as const
