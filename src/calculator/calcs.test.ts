import { calculateUIRaw, calculateDamage } from '.'

test('Bludgeoner', () => {
  const base = {
    weaponRaw: 220,
    sharpness: 'Green',
    attackBoost: 7,
    rawFlatBonus: 20,
  } as const
  expect(calculateUIRaw(base)).toBe(272)
  expect(calculateUIRaw({ ...base, bludgeoner: 3 })).toBe(296)
})

test('Bludgeoner + Kinsect 3', () => {
  const base = {
    weaponRaw: 130,
    attackBoost: 7,
    sharpness: 'Green',
    rawFlatBonus: 20,
    bludgeoner: 3,
  } as const
  expect(calculateUIRaw(base)).toBe(187)
  expect(calculateUIRaw({ ...base, rawModifierPercentage: 15 })).toBe(210)
})

test('Mighty Guard + Bludgeoner', () => {
  const base = {
    weaponRaw: 208,
    attackBoost: 6,
    sharpness: 'Yellow',
    bludgeoner: 1,
    rawFlatBonus: 30,
  } as const
  expect(calculateUIRaw(base)).toBe(274)
  expect(calculateUIRaw({ ...base, mightyGuard: 1 })).toBe(286)
})

test('Dango Booster, Palico Power Drum', () => {
  // mizutsune SA
  const base = {
    weaponRaw: 198,
    attackBoost: 7,
    sharpness: 'White',
    powercharm: true,
    powertalon: true,
  } as const

  expect(calculateUIRaw(base)).toBe(242)
  expect(calculateUIRaw({ ...base, dangoBooster: true })).toBe(251)
  expect(calculateUIRaw({ ...base, dangoBooster: true, powerDrum: true })).toBe(
    262
  )
})

test('296 raw, Green, 32 mv (diablos SA sword neutral X)', () => {
  const params = {
    uiRaw: 296,
    sharpness: 'Green',
    motionValue: 32,
    hitzoneRaw: 100,
    hitzoneEle: 30,
  } as const

  expect(calculateDamage(params).hit).toBe(99)
  expect(calculateDamage(params).crit).toBe(124)
})

test('242 atk 31 ele 22 mv (barioth SA wide swing)', () => {
  const params = {
    uiRaw: 242,
    uiElement: 31,
    criticalBoost: 1,
    motionValue: 22,
    sharpness: 'White',
    hitzoneRaw: 100,
    hitzoneEle: 30,
  } as const

  expect(calculateDamage(params).hit).toBe(81)
  expect(calculateDamage(params).crit).toBe(102)
})

test('rounding: 113 atk, 23 ele 24 mv (gl poke) at ele atk 0/1/3', () => {
  const params = {
    uiRaw: 113,
    uiElement: 23,
    criticalBoost: 1,
    sharpness: 'Green',
    motionValue: 24,
    hitzoneRaw: 100,
    hitzoneEle: 30,
  } as const

  expect(calculateDamage(params).hit).toBe(35)
  expect(calculateDamage(params).crit).toBe(44)

  expect(calculateDamage({ ...params, uiElement: 25 }).hit).toBe(36)
  expect(calculateDamage({ ...params, uiElement: 25 }).crit).toBe(45)

  expect(calculateDamage({ ...params, uiElement: 28 }).hit).toBe(36)
  expect(calculateDamage({ ...params, uiElement: 28 }).crit).toBe(45)
})

test('Dulling Strike', () => {
  const params = {
    uiRaw: 255,
    sharpness: 'Green',
    affinity: -15,
    motionValue: 22,
    hitzoneRaw: 100,
    hitzoneEle: 30,
  } as const

  expect(calculateDamage(params).hit).toBe(59)
  expect(calculateDamage(params).dullingStrikeHit).toBe(71)
  expect(calculateDamage(params).crit).toBe(44)
  expect(calculateDamage(params).dullingStrikeCrit).toBe(53)

  const positiveAffinityParams = { ...params, affinity: 35 }

  expect(calculateDamage(positiveAffinityParams).crit).toBe(74)
  expect(calculateDamage(positiveAffinityParams).dullingStrikeCrit).toBe(88)
})

export {}
