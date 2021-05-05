import React, { useEffect, useMemo, useRef, useState } from 'react'
import { NumberInput, Dropdown, Box, Checkbox } from './components'
import {
  calculateDamage,
  sharpnessRawMultiplier,
  weaknessExploitSkill,
  demondrugTypes,
  Sharpness,
  criticalEyeSkill,
  calculateUIRaw,
  calculateUIElement,
  maximumMightSkill,
  latentPowerSkill,
  agitatorSkill,
} from './calculator'
import { toFixed } from './utils'

export default function Main() {
  // weapon
  const [weaponRaw, setWeaponRaw] = useState(200)
  const [weaponElement, setWeaponElement] = useState(0)
  const [weaponAffinity, setWeaponAffinity] = useState(0)
  const [sharpness, setSharpness] = useState<Sharpness>('White')

  // ramp-up skills
  const [dullingStrike, setDullingStrike] = useState(false)
  const [brutalStrike, setBrutalStrike] = useState(false)
  const [elementExploit, setElementExploit] = useState(false)

  const prevStrike = useRef<'dulling' | 'brutal'>()

  useEffect(() => {
    if (dullingStrike && brutalStrike) {
      switch (prevStrike.current) {
        case 'dulling':
          setDullingStrike(false)
          prevStrike.current = 'brutal'
          break
        case 'brutal':
          setBrutalStrike(false)
          prevStrike.current = 'dulling'
      }
    } else if (dullingStrike) prevStrike.current = 'dulling'
    else if (brutalStrike) prevStrike.current = 'brutal'
  }, [dullingStrike, brutalStrike])

  // skills
  const [attackBoost, setAttackBoost] = useState(0)
  const [elementalAttack, setElementalAttack] = useState(0)
  const [criticalEye, setCriticalEye] = useState(0)
  const [criticalBoost, setCriticalBoost] = useState(0)
  const [criticalElement, setCriticalElement] = useState(0)
  const [wex, setWex] = useState(0)
  const [bludgeoner, setBludgeoner] = useState(0)
  const [ammoTypeUp, setAmmoTypeUp] = useState(0)

  // conditionals
  const [agitator, setAgitator] = useState(0)
  const [maximumMight, setMaximumMight] = useState(0)
  const [latentPower, setLatentPower] = useState(0)

  const [powercharm, setPowercharm] = useState(true)
  const [powertalon, setPowertalon] = useState(true)

  const [mightSeed, setMightSeed] = useState(false)
  const [demonPowder, setDemonPowder] = useState(false)
  const [demondrug, setDemondrug] = useState<keyof typeof demondrugTypes>(
    'None'
  )

  const [miscAb, setMiscAb] = useState(0)
  const [miscAffinity, setMiscAffinity] = useState(0)

  const [motionValue, setMotionValue] = useState(40)
  const [hitzoneRaw, setHitzoneRaw] = useState(100)
  const [hitzoneEle, setHitzoneEle] = useState(30)
  const [rawModifierPercentage, setRawModifierPercentage] = useState(0)
  const [rawMultiplier, setRawMultiplier] = useState(0)
  const [eleMultiplier, setEleMultiplier] = useState(0)

  const rawFlatBonus = useMemo(() => {
    return (
      (powercharm ? 6 : 0) +
      (powertalon ? 9 : 0) +
      (mightSeed ? 10 : 0) +
      (demonPowder ? 10 : 0) +
      demondrugTypes[demondrug] +
      miscAb
    )
  }, [miscAb, powercharm, powertalon, mightSeed, demonPowder, demondrug])

  const uiRaw = useMemo(() => {
    return calculateUIRaw({
      weaponRaw,
      sharpness,
      bludgeoner,
      attackBoost,
      rawModifierPercentage,
      rawFlatBonus,
      powercharm,
      powertalon,
      mightSeed,
      demonPowder,
      demondrug,
      agitator,
    })
  }, [
    weaponRaw,
    attackBoost,
    bludgeoner,
    sharpness,
    rawModifierPercentage,
    rawFlatBonus,
    powercharm,
    powertalon,
    mightSeed,
    demonPowder,
    demondrug,
    agitator,
  ])

  const uiElement = useMemo(() => {
    return calculateUIElement({ weaponElement, elementalAttack })
  }, [weaponElement, elementalAttack])

  const affinity = useMemo(() => {
    const wexBonus = hitzoneRaw >= 45 ? weaknessExploitSkill[wex] : 0
    const criticalEyeBonus = criticalEyeSkill[criticalEye]

    const maximumMightBonus = maximumMightSkill[maximumMight]
    const latentPowerBonus = latentPowerSkill[latentPower]
    const agitatorBonus = agitatorSkill[agitator][1]

    const aff =
      weaponAffinity +
      wexBonus +
      criticalEyeBonus +
      miscAffinity +
      maximumMightBonus +
      latentPowerBonus +
      agitatorBonus

    return aff >= 0 ? Math.min(100, aff) : Math.max(-100, aff)
  }, [
    weaponAffinity,
    criticalEye,
    wex,
    hitzoneRaw,
    miscAffinity,
    maximumMight,
    latentPower,
    agitator,
  ])

  const {
    average,
    hit,
    crit,
    rawHit,
    eleHit,
    rawCrit,
    eleCrit,
    brutalStrikeCrit,
    brutalStrikeRawCrit,
    dullingStrikeHit,
    dullingStrikeRawHit,
    dullingStrikeCrit,
    dullingStrikeRawCrit,
  } = useMemo(() => {
    return calculateDamage({
      uiRaw,
      sharpness,
      motionValue,
      hitzoneEle,
      hitzoneRaw,
      uiElement,
      affinity,
      criticalBoost,
      criticalElement,
      rawMultiplier,
      eleMultiplier,
      brutalStrike,
      dullingStrike,
    })
  }, [
    dullingStrike,
    uiRaw,
    sharpness,
    motionValue,
    hitzoneEle,
    hitzoneRaw,
    uiElement,
    affinity,
    criticalBoost,
    criticalElement,
    rawMultiplier,
    eleMultiplier,
    brutalStrike,
  ])

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
            value={weaponElement}
            onChangeValue={setWeaponElement}
          />
          <NumberInput
            label="Affinity (%)"
            value={weaponAffinity}
            onChangeValue={setWeaponAffinity}
          />
        </div>
        <Dropdown
          options={Object.keys(sharpnessRawMultiplier)}
          label="Sharpness"
          placeholder="Sharpness"
          onChangeValue={(i) =>
            setSharpness(i as keyof typeof sharpnessRawMultiplier)
          }
        />
        Ramp-Up Skills
        <div style={{ height: '8px' }} />
        <Checkbox
          label="Brutal Strike"
          value={brutalStrike}
          onChangeValue={setBrutalStrike}
        />
        <Checkbox
          label="Dulling Strike"
          value={dullingStrike}
          onChangeValue={setDullingStrike}
        />
        {/* <Checkbox
          label="Element Exploit"
          value={elementExploit}
          onChangeValue={setElementExploit}
        /> */}
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
        />
        <Dropdown
          options={[0, 1, 2, 3]}
          label="Critical Element"
          value={criticalElement.toString()}
          onChangeValue={(v) => setCriticalElement(parseInt(v))}
        />
        {/* <Dropdown
          options={[0, 1, 2, 3]}
          label="Ammo Type Up"
          value={ammoTypeUp.toString()}
          onChangeValue={(v) => setAmmoTypeUp(parseInt(v))}
          note="e.g. Pierce/Rapid Fire/Spread Up"
        /> */}
      </Box>
      <Box header="Skills 2">
        <Dropdown
          label="Agitator"
          options={[0, 1, 2, 3, 4, 5]}
          value={agitator.toString()}
          onChangeValue={(v) => setAgitator(parseInt(v))}
        />
        <Dropdown
          label="Latent Power"
          options={[0, 1, 2, 3, 4, 5]}
          value={latentPower.toString()}
          onChangeValue={(v) => setLatentPower(parseInt(v))}
        />
        <Dropdown
          label="Maximum Might"
          options={[0, 1, 2, 3]}
          value={maximumMight.toString()}
          onChangeValue={(v) => setMaximumMight(parseInt(v))}
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
          value={demondrug}
          onChangeValue={(s: string) =>
            setDemondrug(s as keyof typeof demondrugTypes)
          }
        />
        <NumberInput
          label="Misc. Attack Bonus (Flat)"
          value={miscAb}
          onChangeValue={setMiscAb}
          note="e.g. Butterflame"
        />
        <NumberInput
          label="Misc. Affinity"
          value={miscAffinity}
          onChangeValue={setMiscAffinity}
          note="e.g. Cutterfly"
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
          value={rawModifierPercentage}
          onChangeValue={setRawModifierPercentage}
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
        <NumberInput label="Raw" value={toFixed(uiRaw)} disabled />
        <NumberInput label="Element" value={toFixed(uiElement)} disabled />
        <NumberInput label="Affinity (%)" value={affinity} disabled />
      </Box>
      <Box header="Results">
        <div>
          <h3>Average: {toFixed(average)}</h3>
        </div>
        <br />
        <div>
          Hit: {toFixed(hit)} ({toFixed(rawHit)} + {toFixed(eleHit)})
        </div>
        <div>
          Critical: {toFixed(crit)} ({toFixed(rawCrit)} + {toFixed(eleCrit)})
        </div>
        {brutalStrike && (
          <div
            style={{
              textDecoration: affinity >= 0 ? 'line-through' : 'none',
            }}
          >
            <br />
            Brutal Strike: {toFixed(brutalStrikeCrit)} (
            {toFixed(brutalStrikeRawCrit)} + {toFixed(eleCrit)})
          </div>
        )}
        {dullingStrike && (
          <>
            <br />
            <div>
              Dulling Strike Hit: {toFixed(dullingStrikeHit)} (
              {toFixed(dullingStrikeRawHit)} + {toFixed(eleHit)})
            </div>
            <div>
              Dulling Strike Critical: {toFixed(dullingStrikeCrit)} (
              {toFixed(dullingStrikeRawCrit)} + {toFixed(eleCrit)})
            </div>
          </>
        )}
      </Box>
    </div>
  )
}
