import {
  agitatorSkill,
  attackBoostSkill,
  bludgeonerSkill,
  counterstrikeSkill,
  criticalBoostSkill,
  criticalElementSkill,
  demondrugTypes,
  dullingStrikeSharpnessList,
  elementalAttackSkill,
  heroicsSkill,
  mindsEyeSkill,
  offensiveGuardSkill,
  peakPerformanceSkill,
  Sharpness,
  sharpnessElementMultiplier,
  sharpnessRawMultiplier,
} from './skills'

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
  offensiveGuard = 0,
  peakPerformance = 0,
  counterstrike = 0,
  heroics = 0,
  powerSheathe,
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
  offensiveGuard?: number
  agitator?: number
  peakPerformance?: number
  counterstrike?: number
  heroics?: number
  powerSheathe?: boolean
}) {
  const percentageRaw = [
    attackBoostSkill[attackBoost][0],
    bludgeonerSkill[bludgeoner][0].includes(sharpness)
      ? bludgeonerSkill[bludgeoner][1]
      : 0,
    offensiveGuardSkill[offensiveGuard],
    heroicsSkill[heroics],
    powerSheathe ? 10 : 0,
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
    peakPerformanceSkill[peakPerformance] +
    counterstrikeSkill[counterstrike] +
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
  miscRawMultiplier = 0,
  rawMultipliers = [],
  mindsEye = 0,
}: {
  uiRaw: number
  sharpness: Sharpness
  motionValue: number
  hitzoneRaw: number
  criticalBoost?: number
  miscRawMultiplier?: number
  rawMultipliers?: number[]
  mindsEye?: number
}) {
  if (sharpnessRawMultiplier[sharpness] * hitzoneRaw < 45) {
    rawMultipliers.push(mindsEyeSkill[mindsEye])
  }

  const rawHit =
    uiRaw *
    percentage(hitzoneRaw) *
    percentage(motionValue) *
    [...rawMultipliers, miscRawMultiplier].reduce(
      (acc, n) => acc * mPercentage(n),
      1
    ) *
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
  elementExploit,
  miscEleMultiplier = 0,
  eleMultipliers = [],
}: {
  uiElement: number
  sharpness: Sharpness
  hitzoneEle: number
  criticalElement?: number
  miscEleMultiplier?: number
  elementExploit?: boolean
  eleMultipliers?: number[]
}) {
  const eleHit =
    uiElement *
    percentage(hitzoneEle) *
    [...eleMultipliers, miscEleMultiplier].reduce(
      (acc, n) => acc * mPercentage(n),
      1
    ) *
    (hitzoneEle >= 25 && elementExploit ? 1.3 : 1) *
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
  miscRawMultiplier = 0,
  miscEleMultiplier = 0,
  brutalStrike,
  dullingStrike,
  elementExploit,
  rawMultipliers = [],
  eleMultipliers = [],
  mindsEye = 0,
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
  miscRawMultiplier?: number
  miscEleMultiplier?: number
  brutalStrike?: boolean
  dullingStrike?: boolean
  elementExploit?: boolean
  rawMultipliers?: number[]
  eleMultipliers?: number[]
  mindsEye?: number
}) {
  const hasDullingStrike =
    dullingStrike && dullingStrikeSharpnessList.includes(sharpness)

  const { rawHit, rawCrit } = calculateRawDamage({
    uiRaw,
    sharpness,
    motionValue,
    criticalBoost,
    hitzoneRaw,
    miscRawMultiplier,
    rawMultipliers,
    mindsEye,
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
    miscEleMultiplier,
    eleMultipliers,
    elementExploit,
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
