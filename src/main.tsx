import React, { useMemo, useState } from 'react'
import { NumberInput, Dropdown, Box, Checkbox } from './components'
import {
  calculateDamage,
  sharpnessRawMultiplier,
  attackBoost,
  weaknessExploit,
  demondrug,
  elementalAttack,
} from './calculator'

export default function Main() {
  const raw = useState(200)
  const elemental = useState(0)
  const weaponAffinity = useState(0)

  const [ab, setAb] = useState(0)
  const [eleAtk, setEleAtk] = useState(0)
  const [criticalEye, setCriticalEye] = useState(0)
  const [cb, setCb] = useState(0)
  const [criticalElement, setCriticalElement] = useState(0)
  const [wex, setWex] = useState(0)

  const [powercharm, setPowercharm] = useState(true)
  const [powertalon, setPowertalon] = useState(true)

  const [mightSeed, setMightSeed] = useState(false)
  const [demonPowder, setDemonPowder] = useState(false)
  const [dd, setDd] = useState<keyof typeof demondrug>('None')

  const [miscAb, setMiscAb] = useState(0)
  const [miscAffinity, setMiscAffinity] = useState(0)

  const [motionValue, setMotionValue] = useState(40)
  const [hitzoneRaw, setHitzoneRaw] = useState(100)
  const [hitzoneEle, setHitzoneEle] = useState(30)

  const rawPerc = useMemo(() => {
    return attackBoost[ab][0] + miscAb
  }, [ab, miscAb])

  const rawFlat = useMemo(() => {
    return (
      attackBoost[ab][1] +
      miscAb +
      (powercharm ? 6 : 0) +
      (powertalon ? 9 : 0) +
      (mightSeed ? 10 : 0) +
      (demonPowder ? 10 : 0) +
      demondrug[dd]
    )
  }, [ab, miscAb, powercharm, powertalon, mightSeed, demonPowder, dd])

  const elePerc = useMemo(() => {
    return elementalAttack[eleAtk][0]
  }, [eleAtk])

  const eleFlat = useMemo(() => {
    return elementalAttack[eleAtk][1]
  }, [eleAtk])

  const affinity = useMemo(() => {
    const wexBonus = hitzoneRaw >= 45 ? weaknessExploit[wex] : 0
    const criticalEyeBonus = criticalEye * 5
    return weaponAffinity[0] + wexBonus + criticalEyeBonus + miscAffinity
  }, [weaponAffinity, criticalEye, wex, hitzoneRaw, miscAffinity])

  const [sharpness, setSharpness] = useState<
    keyof typeof sharpnessRawMultiplier
  >('White')

  const { average, nonCrit, crit } = calculateDamage(
    raw[0],
    elemental[0],
    rawPerc,
    rawFlat,
    elePerc,
    eleFlat,
    affinity,
    cb,
    criticalElement,
    sharpness,
    motionValue,
    hitzoneRaw,
    hitzoneEle
  )

  return (
    <div className="main">
      <Box header="Weapon">
        <div>
          {Object.entries({ raw, elemental, weaponAffinity }).map(
            ([key, [v, setV]]) => (
              <NumberInput
                key={key}
                label={key}
                value={v}
                onChangeValue={setV}
              />
            )
          )}
        </div>
        <Dropdown
          options={Object.keys(sharpnessRawMultiplier)}
          label="sharpness"
          placeholder="Sharpness"
          onChangeValue={(i) =>
            setSharpness(i as keyof typeof sharpnessRawMultiplier)
          }
          note="Yellow sharpness (and below?) has an additional penalty based on attack animation"
        />
      </Box>
      <Box header="Skills">
        <Dropdown
          options={[0, 1, 2, 3, 4, 5, 6, 7]}
          label="Attack Boost"
          value={ab.toString()}
          onChangeValue={(v) => setAb(parseInt(v))}
        />
        <Dropdown
          options={[0, 1, 2, 3, 4, 5]}
          label="Element Attack"
          value={eleAtk.toString()}
          onChangeValue={(v) => setEleAtk(parseInt(v))}
        />
        <Dropdown
          options={[0, 1, 2, 3, 4, 5, 6, 7]}
          label="Critical Eye"
          value={criticalEye.toString()}
          onChangeValue={(v) => setCriticalEye(parseInt(v))}
        />
        <Dropdown
          options={[0, 1, 2, 3]}
          label="Weakness Exploit"
          value={wex.toString()}
          onChangeValue={(v) => setWex(parseInt(v))}
          note="Activates if raw hitzone >=45"
        />
        <Dropdown
          options={[0, 1, 2, 3]}
          label="Critical Boost"
          value={cb.toString()}
          onChangeValue={(v) => setCb(parseInt(v))}
        />{' '}
        <Dropdown
          options={[0, 1, 2, 3]}
          label="Critical Element"
          value={criticalElement.toString()}
          onChangeValue={(v) => setCriticalElement(parseInt(v))}
        />
      </Box>
      <Box header="Miscellaneous">
        <Checkbox
          label="Powercharm"
          value={powercharm}
          onChangeValue={setPowercharm}
        />
        <Checkbox
          label="Powertalon"
          value={powertalon}
          onChangeValue={setPowertalon}
        />
        <Checkbox
          label="Might Seed"
          value={mightSeed}
          onChangeValue={setMightSeed}
        />
        <Checkbox
          label="Demon Powder"
          value={demonPowder}
          onChangeValue={setDemonPowder}
        />
        <div style={{ height: '8px' }} />
        <Dropdown
          options={['None', 'Demondrug', 'Mega Demondrug']}
          label="Demondrug"
          value={dd}
          onChangeValue={(s: string) => setDd(s as keyof typeof demondrug)}
        />
        <NumberInput
          label="Attack"
          value={miscAb}
          onChangeValue={setMiscAb}
          note="e.g. Petalace"
        />
        <NumberInput
          label="Affinity"
          value={miscAffinity}
          onChangeValue={setMiscAffinity}
          note="e.g. Latent Power, etc."
        />
      </Box>
      <Box header="Monster">
        <NumberInput
          label="Motion Value"
          value={motionValue}
          onChangeValue={setMotionValue}
        />
        <NumberInput
          label="Hitzone (Raw)"
          value={hitzoneRaw}
          onChangeValue={setHitzoneRaw}
        />
        <NumberInput
          label="Hitzone (Elemental)"
          value={hitzoneEle}
          onChangeValue={setHitzoneEle}
        />
      </Box>
      <Box header="Derived Attributes">
        <NumberInput label="Raw (%)" value={rawPerc} disabled />
        <NumberInput label="Raw (+)" value={rawFlat} disabled />
        <NumberInput label="Affinity (%)" value={affinity} disabled />
      </Box>
      <Box header="Results">
        <div>
          <strong>Average: {parseFloat(average.toFixed(2))}</strong>
        </div>
        <div>nonCrit: {parseFloat(nonCrit.toFixed(2))}</div>
        <div>Crit: {parseFloat(crit.toFixed(2))}</div>
      </Box>
    </div>
  )
}
