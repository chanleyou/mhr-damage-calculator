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
  criticalEyeSkill,
  calculateUIElement,
  calculateUIRaw,
} from './calculator'
import { toFixed } from './utils'

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
  const [rawModifier, setRawModifier] = useState(0)
  const [rawMultiplier, setRawMultiplier] = useState(0)
  const [eleMultiplier, setEleMultiplier] = useState(0)

  const rawFlatBonus = useMemo(() => {
    return (
      (powercharm ? 6 : 0) +
      (powertalon ? 9 : 0) +
      (mightSeed ? 10 : 0) +
      (demonPowder ? 10 : 0) +
      demondrug[dd] +
      miscAb
    )
  }, [miscAb, powercharm, powertalon, mightSeed, demonPowder, dd])

  const elePerc = useMemo(() => {
    return elementalAttackSkill[elementalAttack][0]
  }, [elementalAttack])

  const eleFlat = useMemo(() => {
    return elementalAttackSkill[elementalAttack][1]
  }, [elementalAttack])

  const statusRaw = useMemo(() => {
    return calculateUIRaw(
      weaponRaw,
      attackBoostSkill[attackBoost][1],
      attackBoostSkill[attackBoost][0],
      bludgeonerSkill[bludgeoner][0].includes(sharpness)
        ? bludgeonerSkill[bludgeoner][1]
        : 0,
      rawModifier,
      rawFlatBonus
    )
  }, [weaponRaw, attackBoost, bludgeoner, sharpness, rawModifier, rawFlatBonus])

  const statusEle = useMemo(() => {
    return calculateUIElement(weaponElemental, elePerc, eleFlat)
  }, [weaponElemental, elePerc, eleFlat])

  const affinity = useMemo(() => {
    const wexBonus = hitzoneRaw >= 45 ? weaknessExploitSkill[wex] : 0
    const criticalEyeBonus = criticalEyeSkill[criticalEye]

    const aff = weaponAffinity + wexBonus + criticalEyeBonus + miscAffinity

    return aff >= 0 ? Math.min(100, aff) : Math.max(-100, aff)
  }, [weaponAffinity, criticalEye, wex, hitzoneRaw, miscAffinity])

  const { average, nonCrit, crit, raw, ele, rawCrit, eleCrit } = useMemo(
    () =>
      calculateDamage(
        statusRaw,
        statusEle * ((100 + eleMultiplier) / 100),
        affinity,
        sharpness,
        criticalBoost,
        criticalElement,
        motionValue,
        hitzoneRaw,
        hitzoneEle
      ),
    [
      statusRaw,
      statusEle,
      eleMultiplier,
      affinity,
      sharpness,
      criticalBoost,
      criticalElement,
      motionValue,
      hitzoneRaw,
      hitzoneEle,
    ]
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
      <Box header="Others">
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
          label="Misc. Attack Bonus (Flat)"
          value={miscAb}
          onChangeValue={setMiscAb}
          note="e.g. Petalace, Punishing Draw"
        />
        <NumberInput
          label="Misc. Affinity"
          value={miscAffinity}
          onChangeValue={setMiscAffinity}
          note="e.g. Latent Power, Maximum Might"
        />
      </Box>
      <Box header="Attack">
        <NumberInput
          label="Motion Value"
          value={motionValue}
          onChangeValue={setMotionValue}
        />
        <NumberInput
          label="Raw Hitzone"
          value={hitzoneRaw}
          onChangeValue={setHitzoneRaw}
        />
        <NumberInput
          label="Element Hitzone"
          value={hitzoneEle}
          onChangeValue={setHitzoneEle}
        />
        <NumberInput
          label="Raw Attack Modifier (Percentage)"
          value={rawModifier}
          onChangeValue={setRawModifier}
          note="e.g. Kinsect Buff"
        />
        <NumberInput
          label="Raw Damage Multiplier (%)"
          value={rawMultiplier}
          onChangeValue={setRawMultiplier}
          note="e.g. SA Power Phial"
        />
        <NumberInput
          label="Element Damage Multiplier (%)"
          value={eleMultiplier}
          onChangeValue={setEleMultiplier}
          note="e.g. Greatsword charge attacks"
        />
      </Box>
      <Box header="Attributes">
        <NumberInput
          label="Raw"
          value={toFixed(statusRaw)}
          disabled
          note="Should match in-game status"
        />
        <NumberInput label="Element" value={toFixed(statusEle)} disabled />
        <NumberInput label="Affinity (%)" value={affinity} disabled />
      </Box>
      <Box header="Results">
        <div>
          <h3>Average: {toFixed(average)}</h3>
        </div>
        <br />
        <div>
          nonCrit: {toFixed(nonCrit)} ({toFixed(raw)} + {toFixed(ele)})
        </div>
        <div>
          Crit: {toFixed(crit)} ({toFixed(rawCrit)} + {toFixed(eleCrit)})
        </div>
      </Box>
    </div>
  )
}
