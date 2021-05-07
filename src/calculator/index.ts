function percentage(n: number) {
  return n / 100
}

function mPercentage(n: number) {
  return percentage(100 + n)
}

function calculateWeightedAverage(
  arr: ([number, number] | undefined)[],
  defaultValue: number
) {
  let result = 0
  let remainingPercentage = 100
  arr.forEach((i) => {
    if (!i) return
    const [p, n] = i
    result += percentage(p) * n
    remainingPercentage -= p
  })
  return result + percentage(remainingPercentage) * defaultValue
}

export function calculateUIRaw({
  weaponRaw,
  sharpness,
  attackBoost = 0,
  bludgeoner = 0,
  rawModifierPercentage = 0,
  rawFlatBonus = 0,
  powercharm,
  powertalon,
  mightSeed,
  demonPowder,
  dangoBooster,
  demondrug = 'None',
  powerDrum,
  agitator = 0,
  mightyGuard = 0,
}: {
  weaponRaw: number
  sharpness: Sharpness
  attackBoost?: number
  bludgeoner?: number
  rawModifierPercentage?: number
  rawFlatBonus?: number
  powercharm?: boolean
  powertalon?: boolean
  mightSeed?: boolean
  demonPowder?: boolean
  dangoBooster?: boolean
  demondrug?: keyof typeof demondrugTypes
  powerDrum?: boolean
  mightyGuard?: number
  agitator?: number
}) {
  const percentageRaw = [
    attackBoostSkill[attackBoost][0],
    bludgeonerSkill[bludgeoner][0].includes(sharpness)
      ? bludgeonerSkill[bludgeoner][1]
      : 0,
    mightyGuardSkill[mightyGuard],
    powerDrum ? 5 : 0,
    rawModifierPercentage,
  ].reduce((raw, b) => raw * mPercentage(b), weaponRaw)

  const flatBonuses =
    attackBoostSkill[attackBoost][1] +
    agitatorSkill[agitator][0] +
    (powercharm ? 6 : 0) +
    (powertalon ? 9 : 0) +
    (mightSeed ? 10 : 0) +
    (demonPowder ? 10 : 0) +
    (dangoBooster ? 9 : 0) +
    demondrugTypes[demondrug] +
    rawFlatBonus

  return Math.floor(percentageRaw + flatBonuses + 0.1)
}

export function calculateUIElement({
  weaponElement = 0,
  elementalAttack = 0,
  eleModifierPercentage = 0,
}: {
  weaponElement: number
  elementalAttack?: number
  eleModifierPercentage?: number
}) {
  if (weaponElement === 0) return 0
  const elementalAttackPercentage = elementalAttackSkill[elementalAttack][0]
  const elementalAttackFlat = elementalAttackSkill[elementalAttack][1]

  return Math.floor(
    weaponElement *
      mPercentage(elementalAttackPercentage) *
      mPercentage(eleModifierPercentage) +
      elementalAttackFlat
  )
}

export function calculateRawDamage({
  uiRaw,
  sharpness,
  motionValue,
  hitzoneRaw,
  criticalBoost = 0,
  rawMultiplier = 0,
}: {
  uiRaw: number
  sharpness: Sharpness
  motionValue: number
  hitzoneRaw: number
  criticalBoost?: number
  rawMultiplier?: number
}) {
  const rawHit =
    uiRaw *
    percentage(hitzoneRaw) *
    percentage(motionValue) *
    mPercentage(rawMultiplier) *
    sharpnessRawMultiplier[sharpness]

  return {
    rawHit,
    rawCrit: rawHit * criticalBoostSkill[criticalBoost],
  }
}

export function calculateElementDamage({
  uiElement,
  sharpness,
  hitzoneEle,
  criticalElement = 0,
  eleMultiplier = 0,
}: {
  uiElement: number
  sharpness: Sharpness
  hitzoneEle: number
  criticalElement?: number
  eleMultiplier?: number
}) {
  const eleHit =
    uiElement *
    percentage(hitzoneEle) *
    mPercentage(eleMultiplier) *
    sharpnessElementMultiplier[sharpness]

  return {
    eleHit,
    eleCrit: eleHit * criticalElementSkill[criticalElement],
  }
}

export function calculateDamage({
  uiRaw,
  sharpness,
  motionValue,
  hitzoneRaw,
  hitzoneEle,
  uiElement = 0,
  affinity = 0,
  criticalBoost = 0,
  criticalElement = 0,
  rawMultiplier = 0,
  eleMultiplier = 0,
  brutalStrike,
  dullingStrike,
}: {
  uiRaw: number
  sharpness: Sharpness
  motionValue: number
  hitzoneRaw: number
  hitzoneEle: number
  uiElement?: number
  affinity?: number
  criticalBoost?: number
  criticalElement?: number
  rawMultiplier?: number
  eleMultiplier?: number
  brutalStrike?: boolean
  dullingStrike?: boolean
}) {
  const hasDullingStrike =
    dullingStrike && dullingStrikeSharpnessList.includes(sharpness)

  const { rawHit, rawCrit } = calculateRawDamage({
    uiRaw,
    sharpness,
    motionValue,
    criticalBoost,
    hitzoneRaw,
    rawMultiplier,
  })

  const brutalStrikeRawCrit = rawHit * 1.5
  const dullingStrikeRawHit = rawHit * 1.2
  const negativeRawCrit = rawHit * 0.75
  const dullingStrikeNegativeRawCrit = rawHit * 0.75 * 1.2
  const dullingStrikeRawCrit = rawCrit * 1.2

  const { eleHit, eleCrit } = calculateElementDamage({
    uiElement,
    sharpness,
    hitzoneEle,
    criticalElement,
    eleMultiplier,
  })

  const hit = Math.round(rawHit) + Math.round(eleHit)
  const crit = Math.round(rawCrit) + Math.round(eleCrit)
  const negativeCrit = Math.round(negativeRawCrit) + Math.round(eleHit)
  const brutalStrikeCrit = Math.round(brutalStrikeRawCrit) + Math.round(eleHit)

  const dullingStrikeHit = Math.round(dullingStrikeRawHit) + Math.round(eleHit)
  const dullingStrikeCrit =
    Math.round(dullingStrikeRawCrit) + Math.round(eleCrit)
  const dullingStrikeNegativeCrit =
    Math.round(dullingStrikeNegativeRawCrit) + Math.round(eleHit)

  const positiveAffinity =
    affinity * (affinity > 0 ? 1 : 0) * (hasDullingStrike ? 0.8 : 1)

  const negativeAffinity =
    Math.abs(affinity) *
    (affinity < 0 ? 1 : 0) *
    (brutalStrike ? 0.75 : 1) *
    (hasDullingStrike ? 0.8 : 1)

  const brutalStrikeAffinity =
    Math.abs(affinity) * (affinity < 0 ? 1 : 0) * (brutalStrike ? 0.25 : 0)

  const dullingStrikeCritChance =
    affinity * (affinity > 0 ? 1 : 0) * (hasDullingStrike ? 0.2 : 0)

  const dullingStrikeHitChance =
    (100 - Math.abs(affinity)) * (hasDullingStrike ? 0.2 : 0)

  const dullingStrikeNegativeCritChance =
    Math.abs(affinity) * (affinity < 0 ? 1 : 0) * (hasDullingStrike ? 0.2 : 1)

  const average = calculateWeightedAverage(
    [
      [positiveAffinity, crit],
      [negativeAffinity, negativeCrit],
      [brutalStrikeAffinity, brutalStrikeCrit],
      [dullingStrikeHitChance, dullingStrikeHit],
      [dullingStrikeCritChance, dullingStrikeCrit],
      [dullingStrikeNegativeCritChance, dullingStrikeNegativeCrit],
    ],
    hit
  )

  return {
    average,
    hit,
    crit: affinity >= 0 ? crit : negativeCrit,
    rawHit,
    eleHit,
    rawCrit: affinity >= 0 ? rawCrit : negativeRawCrit,
    eleCrit: affinity >= 0 ? eleCrit : eleHit,
    brutalStrikeCrit,
    brutalStrikeRawCrit,
    dullingStrikeHit,
    dullingStrikeRawHit,
    dullingStrikeRawCrit:
      affinity >= 0 ? dullingStrikeRawCrit : dullingStrikeNegativeRawCrit,
    dullingStrikeCrit:
      affinity >= 0 ? dullingStrikeCrit : dullingStrikeNegativeCrit,
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

export const mightyGuardSkill = [0, 5, 10, 15] as const

export const ammoTypeUpSkill = [0, 5, 10, 20] as const

export const dullingStrikeSharpnessList: Sharpness[] = [
  'Red',
  'Orange',
  'Yellow',
  'Green',
]
