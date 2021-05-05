import { calculateUIRaw, calculateDamage } from '.'

test('220 raw weapon, green, ab 7, demon petalace', () => {
  expect(calculateUIRaw(220, 10, 10, 0, 0, 20)).toBe(272)
})

test('220 raw weapon, green, ab 7, bludgeoner 3, demon petalace', () => {
  expect(calculateUIRaw(220, 10, 10, 10, 0, 20)).toBe(296)
})

test('210 raw weapon, ab 7, demon petalace', () => {
  expect(calculateUIRaw(210, 10, 10, 0, 0, 20)).toBe(261)
})

test('210 raw weapon, ab 7, demon petalace, kinsect 3x buff', () => {
  expect(calculateUIRaw(210, 10, 10, 0, 15, 20)).toBe(295)
})

test('50 raw weapon, yellow, ab 7, bludgeoner 3, demon petalace', () => {
  expect(calculateUIRaw(50, 10, 10, 10, 0, 20)).toBe(90)
})

test('50 raw weapon, yellow, ab 7, bludgeoner 3, demon petalace, kinsect 3x buff', () => {
  expect(calculateUIRaw(50, 10, 10, 10, 15, 20)).toBe(99)
})

test('130 raw weapon, green, ab 7, bludgeoner 3, demon petalace', () => {
  expect(calculateUIRaw(130, 10, 10, 10, 0, 20)).toBe(187)
})

test('130 raw weapon, green, ab 7, bludgeoner 3, demon petalace, kinsect 3x buff', () => {
  expect(calculateUIRaw(130, 10, 10, 10, 15, 20)).toBe(210)
})

test('296 raw, green, 32 mv (diablos SA sword neutral X)', () => {
  expect(calculateDamage(296, 0, 0, 'green', 0, 0, 32, 100, 30).crit).toBe(124)
  expect(calculateDamage(296, 0, 0, 'green', 0, 0, 32, 100, 30).nonCrit).toBe(
    99
  )
})

test('242 atk 31 ele 22 mv (barioth SA wide swing)', () => {
  expect(calculateDamage(242, 31, 1, 'white', 1, 0, 22, 100, 30).crit).toBe(102)
  expect(calculateDamage(242, 31, 1, 'white', 1, 0, 22, 100, 30).nonCrit).toBe(
    81
  )
})

test('rounding: 113 atk, 23 ele 24 mv (gl poke) at ele atk 0/1/3', () => {
  expect(calculateDamage(113, 23, 1, 'green', 1, 0, 24, 100, 30).crit).toBe(44)
  expect(calculateDamage(113, 23, 1, 'green', 1, 0, 24, 100, 30).nonCrit).toBe(
    35
  )
  expect(calculateDamage(113, 25, 1, 'green', 1, 0, 24, 100, 30).crit).toBe(45)
  expect(calculateDamage(113, 25, 1, 'green', 1, 0, 24, 100, 30).nonCrit).toBe(
    36
  )
  expect(calculateDamage(113, 28, 1, 'green', 1, 0, 24, 100, 30).crit).toBe(45)
  expect(calculateDamage(113, 28, 1, 'green', 1, 0, 24, 100, 30).nonCrit).toBe(
    36
  )
})

export {}
