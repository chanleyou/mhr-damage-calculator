import React, { useMemo, useState } from 'react'
import { NumberInput, Dropdown, Box, Checkbox } from './components'
import {
  calculateDamage,
  sharpnessRawMultiplier,
  attackBoostSkill,
  weaknessExploitSkill,
  demondrug,
  elementalAttackSkill,
  Sharpness,
  bludgeonerSkill,
} from './calculator'

export default function Main() {
  // weapon
  const [weaponRaw, setWeaponRaw] = useState(200)
  const [weaponElemental, setWeaponElemental] = useState(0)
  const [weaponAffinity, setWeaponAffinity] = useState(0)
  const [sharpness, setSharpness] = useState<Sharpness>('white')

  // skills
  const [attackBoost, setAttackBoost] = useState(0)
  const [elementalAttack, setElementalAttack] = useState(0)
  const [criticalEye, setCriticalEye] = useState(0)
  const [criticalBoost, setCriticalBoost] = useState(0)
  const [criticalElement, setCriticalElement] = useState(0)
  const [wex, setWex] = useState(0)
  const [bludgeoner, setBludgeoner] = useState(0)

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
    return (
      attackBoostSkill[attackBoost][0] +
      (bludgeonerSkill[bludgeoner][0].includes(sharpness)
        ? bludgeonerSkill[bludgeoner][1]
        : 0)
    )
  }, [attackBoost, bludgeoner, sharpness])

  const rawFlat = useMemo(() => {
    return (
      attackBoostSkill[attackBoost][1] +
      (powercharm ? 6 : 0) +
      (powertalon ? 9 : 0) +
      (mightSeed ? 10 : 0) +
      (demonPowder ? 10 : 0) +
      demondrug[dd] +
      miscAb
    )
  }, [attackBoost, miscAb, powercharm, powertalon, mightSeed, demonPowder, dd])

  const elePerc = useMemo(() => {
    return elementalAttackSkill[elementalAttack][0]
  }, [elementalAttack])

  const eleFlat = useMemo(() => {
    return elementalAttackSkill[elementalAttack][1]
  }, [elementalAttack])

  const affinity = useMemo(() => {
    const wexBonus = hitzoneRaw >= 45 ? weaknessExploitSkill[wex] : 0
    const criticalEyeBonus = criticalEye * 5
    return weaponAffinity + wexBonus + criticalEyeBonus + miscAffinity
  }, [weaponAffinity, criticalEye, wex, hitzoneRaw, miscAffinity])

  const { average, nonCrit, crit } = calculateDamage(
    weaponRaw,
    weaponElemental,
    rawPerc,
    rawFlat,
    elePerc,
    eleFlat,
    affinity,
    criticalBoost,
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
          <NumberInput
            label="Raw"
            value={weaponRaw}
            onChangeValue={setWeaponRaw}
          />
          <NumberInput
            label="Element"
            value={weaponElemental}
            onChangeValue={setWeaponElemental}
          />
          <NumberInput
            label="Affinity (%)"
            value={weaponAffinity}
            onChangeValue={setWeaponAffinity}
          />
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
          value={attackBoost.toString()}
          onChangeValue={(v) => setAttackBoost(parseInt(v))}
        />
        <Dropdown
          options={[0, 1, 2, 3, 4, 5]}
          label="Element Attack"
          value={elementalAttack.toString()}
          onChangeValue={(v) => setElementalAttack(parseInt(v))}
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
          label="Bludgeoner"
          value={bludgeoner.toString()}
          onChangeValue={(v) => setBludgeoner(parseInt(v))}
          note="Activates at yellow/yellow/green sharpness"
        />
        <Dropdown
          options={[0, 1, 2, 3]}
          label="Critical Boost"
          value={criticalBoost.toString()}
          onChangeValue={(v) => setCriticalBoost(parseInt(v))}
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