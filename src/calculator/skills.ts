// figure out a way to remove this redundancy
export const weapons = ['Melee', 'Great Sword', 'Ranged']
export type Weapon = 'Melee' | 'Great Sword' | 'Ranged'

export type Sharpness =
  | 'Red'
  | 'Orange'
  | 'Yellow'
  | 'Green'
  | 'Blue'
  | 'White'
  | 'Ranged'

export const sharpnessRawMultiplier: { [K in Sharpness]: number } = {
  White: 1.32,
  Blue: 1.2,
  Green: 1.05,
  Yellow: 1,
  Orange: 0.75,
  Red: 0.5,
  Ranged: 1,
} as const

export const sharpnessElementMultiplier: { [K in Sharpness]: number } = {
  White: 1.15,
  Blue: 1.0625,
  Green: 1,
  Yellow: 0.75,
  Orange: 0.5,
  Red: 0.25,
  Ranged: 1,
} as const

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

/** [percentage, flat] */
export const elementalAttackSkill = [
  [0, 0],
  [0, 2],
  [0, 3],
  [5, 4],
  [10, 4],
  [20, 4],
]

export const criticalBoostSkill = [1.25, 1.3, 1.35, 1.4] as const

export const weaknessExploitSkill = [0, 15, 30, 50] as const

export const criticalElementSkill = [1, 1.05, 1.1, 1.15] as const

export const demondrugTypes = {
  None: 0,
  Demondrug: 5,
  'Mega Demondrug': 7,
} as const

export const bludgeonerSkill: [Sharpness[], number][] = [
  [[], 0],
  [['Red', 'Orange', 'Yellow'], 5],
  [['Red', 'Orange', 'Yellow'], 10],
  [['Red', 'Orange', 'Yellow', 'Green'], 10],
]

export const maximumMightSkill = [0, 10, 20, 30] as const

export const latentPowerSkill = [0, 10, 20, 30, 40, 50] as const

/** [attack, affinity] */
export const agitatorSkill = [
  [0, 0],
  [4, 3],
  [8, 5],
  [12, 7],
  [16, 10],
  [20, 15],
]

export const offensiveGuardSkill = [0, 5, 10, 15] as const

export const shotTypeUpSkill = [0, 5, 10, 20] as const

export const rapidFireUpSkill = [0, 50, 10, 12] as const

export const dullingStrikeSharpnessList: Sharpness[] = [
  'Red',
  'Orange',
  'Yellow',
  'Green',
]

export const peakPerformanceSkill = [0, 5, 10, 20] as const

export const counterstrikeSkill = [0, 10, 15, 25]

// %
export const heroicsSkill = [0, 0, 5, 5, 10, 30]

export const mindsEyeSkill = [0, 10, 15, 30]
