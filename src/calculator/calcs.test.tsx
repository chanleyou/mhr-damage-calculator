import { calculateEffectiveRaw, calculateDamage } from '.'

test('220 raw weapon, green, ab 7, demon petalace', () => {
  expect(calculateEffectiveRaw(220, 10, 10, 0, 0, 20)).toBe(272)
})

test('220 raw weapon, green, ab 7, bludgeoner 3, demon petalace', () => {
  expect(calculateEffectiveRaw(220, 10, 10, 10, 0, 20)).toBe(296)
})

test('296 raw, green, 32 mv', () => {
  expect(calculateDamage(296, 0, 0, 'green', 0, 0, 32, 100, 30).crit).toBe(124)

  expect(calculateDamage(296, 0, 0, 'green', 0, 0, 32, 100, 30).nonCrit).toBe(
    99
  )
})

test('210 raw weapon, ab 7, demon petalace', () => {
  expect(calculateEffectiveRaw(210, 10, 10, 0, 0, 20)).toBe(261)
})

test('210 raw weapon, ab 7, demon petalace, kinsect 3x buff', () => {
  expect(calculateEffectiveRaw(210, 10, 10, 0, 15, 20)).toBe(295)
})

test('50 raw weapon, yellow, ab 7, bludgeoner 3, demon petalace', () => {
  expect(calculateEffectiveRaw(50, 10, 10, 10, 0, 20)).toBe(90)
})

test('50 raw weapon, yellow, ab 7, bludgeoner 3, demon petalace, kinsect 3x buff', () => {
  expect(calculateEffectiveRaw(50, 10, 10, 10, 15, 20)).toBe(99)
})

test('130 raw weapon, green, ab 7, bludgeoner 3, demon petalace', () => {
  expect(calculateEffectiveRaw(130, 10, 10, 10, 0, 20)).toBe(187)
})

test('130 raw weapon, green, ab 7, bludgeoner 3, demon petalace, kinsect 3x buff', () => {
  expect(calculateEffectiveRaw(130, 10, 10, 10, 15, 20)).toBe(210)
})

export {}
