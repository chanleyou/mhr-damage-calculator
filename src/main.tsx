import React, { useMemo, useState } from 'react'
import { NumberInput, Dropdown } from './components'
import { calculateDamage, sharpnessRawMultiplier, attackBoost } from './calculator'

export default function Main() {
  const raw = useState(200)
  const elemental = useState(0)
  const weaponAffinity = useState(0)

  const [ab, setAb] = useState(0)
  const [ce, setCe] = useState(0)
  const [cb, setCb] = useState(0)

  const rawPerc = useMemo(() => {
    return attackBoost[ab][0]
  }, [ab])

  const rawFlat = useMemo(() => {
    return attackBoost[ab][1]
  }, [ab])

  const affinity = useMemo(() => {
    return weaponAffinity[0] + ce * 5
  }, [weaponAffinity, ce])

  const critMulti = useMemo(() => {
    return 1.25 + cb * 0.05
  }, [cb])

  const [sharpness, setSharpness] = useState<keyof typeof sharpnessRawMultiplier>('White')

  const { average, nonCrit, crit } = calculateDamage(
    raw[0],
    rawPerc,
    rawFlat,
    affinity,
    critMulti,
    sharpnessRawMultiplier[sharpness],
  )

  return (
    <div>
      <div className="box">
        <h1>Weapon</h1>
        <div>
          {Object.entries({ raw, elemental, weaponAffinity }).map(([key, [v, setV]]) => (
            <NumberInput key={key} label={key} value={v} onChangeValue={setV} />
          ))}
        </div>
        <Dropdown
          options={Object.keys(sharpnessRawMultiplier)}
          label="sharpness"
          placeholder="Sharpness"
          onChangeValue={(i) => setSharpness(i as keyof typeof sharpnessRawMultiplier)}
        />
      </div>
      <div className="box">
        <h1>Derived Attributes</h1>
        <NumberInput label="Raw (%)" value={rawPerc} disabled />
        <NumberInput label="Raw (+)" value={rawFlat} disabled />
        <NumberInput label="Affinity (%)" value={affinity} disabled />
      </div>
      <div className="box">
        <h1>Skills</h1>
        <Dropdown
          options={[0, 1, 2, 3, 4, 5, 6, 7]}
          label="Attack Boost"
          onChangeValue={(v) => setAb(parseInt(v))}
        />
        <Dropdown
          options={[0, 1, 2, 3, 4, 5, 6, 7]}
          label="Critical Eye"
          onChangeValue={(v) => setCe(parseInt(v))}
        />
        <Dropdown
          options={[0, 1, 2, 3]}
          label="Critical Boost"
          onChangeValue={(v) => setCb(parseInt(v))}
        />
      </div>
      <div className="box">
        <div>Average: {average.toFixed(2)}</div>
        <div>nonCrit: {nonCrit.toFixed(2)}</div>
        <div>Crit: {crit.toFixed(2)}</div>
      </div>
    </div>
  )
}
