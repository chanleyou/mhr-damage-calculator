import React, { useMemo, useState } from 'react'
import {
  NumberInput,
  Dropdown,
  Box,
  Checkbox,
  useNumberDropdown,
} from './components'
import {
  calculateDamage,
  calculateUIRaw,
  calculateUIElement,
} from './calculator'
import {
  Weapon,
  maximumMightSkill,
  latentPowerSkill,
  agitatorSkill,
  weaknessExploitSkill,
  demondrugTypes,
  Sharpness,
  criticalEyeSkill,
  sharpnessRawMultiplier,
  attackBoostSkill,
  elementalAttackSkill,
  bludgeonerSkill,
  criticalBoostSkill,
  weapons,
  shotTypeUpSkill,
  rapidFireUpSkill,
  counterstrikeSkill,
  heroicsSkill,
  mindsEyeSkill,
  SwitchAxePhialType,
} from './calculator/skills'
import { toFixed } from './utils'

export default function Main() {
  // weapon
  const [weaponType, setWeaponType] = useState<Weapon>('Melee')
  const [weaponRaw, setWeaponRaw] = useState(200)
  const [weaponElement, setWeaponElement] = useState(0)
  const [weaponAffinity, setWeaponAffinity] = useState(0)
  const [sharpness, setSharpness] = useState<Sharpness>('White')

  // rampage skills
  const [rampageSkill, setRampageSkill] =
    useState<'brutalStrike' | 'dullingStrike' | 'elementExploit'>()

  // skills
  const [attackBoost, setAttackBoost] = useState(0)
  const [elementalAttack, setElementalAttack] = useState(0)
  const [criticalEye, setCriticalEye] = useState(0)
  const [criticalBoost, setCriticalBoost] = useState(0)
  const [criticalElement, setCriticalElement] = useState(0)
  const [wex, setWex] = useState(0)
  const [bludgeoner, renderBludgeoner] = useNumberDropdown({
    skill: bludgeonerSkill,
    label: 'Bludgeoner',
  })
  const [mindsEye, renderMindsEye] = useNumberDropdown({
    skill: mindsEyeSkill,
    label: "Mind's Eye",
    note: 'if sharpness * raw hitzone < 45',
  })

  // ranged
  const [shotTypeUp, setShotTypeUp] = useState(0)
  const [rapidFireUp, setRapidFireUp] = useState(0)

  // conditionals
  const [agitator, setAgitator] = useState(0)
  const [maximumMight, setMaximumMight] = useState(0)
  const [latentPower, setLatentPower] = useState(0)
  const [offensiveGuard, setOffensiveGuard] = useState(0)
  const [peakPerformance, setPeakPerformance] = useState(0)
  const [counterstrike, renderCounterstrike] = useNumberDropdown({
    skill: counterstrikeSkill,
    label: 'Counterstrike',
  })
  const [heroics, renderHeroics] = useNumberDropdown({
    skill: heroicsSkill,
    label: 'Heroics',
  })

  const [powercharm, setPowercharm] = useState(true)
  const [powertalon, setPowertalon] = useState(true)

  const [dangoBooster, setDangoBooster] = useState(false)
  const [mightSeed, setMightSeed] = useState(false)
  const [demonPowder, setDemonPowder] = useState(false)
  const [demondrug, setDemondrug] =
    useState<keyof typeof demondrugTypes>('None')
  const [powerDrum, setPowerDrum] = useState(false)
  const [rousingRoar, setRousingRoar] = useState(false)

  // great sword
  const [powerSheathe, setPowerSheathe] = useState(false)

  const [saPhial, setSaPhial] = useState<SwitchAxePhialType>()

  const [miscAb, setMiscAb] = useState(0)
  const [miscAffinity, setMiscAffinity] = useState(0)

  const [motionValue, setMotionValue] = useState(40)
  const [hitzoneRaw, setHitzoneRaw] = useState(100)
  const [hitzoneEle, setHitzoneEle] = useState(30)
  const [rawModifierPercentage, setRawModifierPercentage] = useState(0)
  const [miscRawMultiplier, setMiscRawMultiplier] = useState(0)
  const [miscEleMultiplier, setMiscEleMultiplier] = useState(0)
  const [cannotCrit, setCannotCrit] = useState(false)

  const uiRaw = useMemo(() => {
    return calculateUIRaw({
      weaponRaw,
      sharpness: weaponType === 'Ranged' ? 'Ranged' : sharpness,
      bludgeoner,
      attackBoost,
      rawModifierPercentage,
      rawFlatBonus: miscAb,
      powercharm,
      powertalon,
      mightSeed,
      dangoBooster,
      demonPowder,
      demondrug,
      powerDrum,
      agitator,
      offensiveGuard,
      peakPerformance,
      counterstrike,
      heroics,
      powerSheathe: weaponType === 'Great Sword' && powerSheathe,
    })
  }, [
    weaponRaw,
    attackBoost,
    bludgeoner,
    sharpness,
    rawModifierPercentage,
    miscAb,
    powercharm,
    powertalon,
    mightSeed,
    dangoBooster,
    demonPowder,
    demondrug,
    powerDrum,
    agitator,
    offensiveGuard,
    peakPerformance,
    counterstrike,
    heroics,
    powerSheathe,
    weaponType,
  ])

  const uiElement = useMemo(() => {
    return calculateUIElement({ weaponElement, elementalAttack })
  }, [weaponElement, elementalAttack])

  const affinity = useMemo(() => {
    if (cannotCrit) return 0
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
      agitatorBonus +
      (rousingRoar ? 30 : 0)

    return aff >= 0 ? Math.min(100, aff) : Math.max(-100, aff)
  }, [
    cannotCrit,
    weaponAffinity,
    criticalEye,
    wex,
    hitzoneRaw,
    miscAffinity,
    maximumMight,
    latentPower,
    agitator,
    rousingRoar,
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
      sharpness: weaponType === 'Ranged' ? 'Ranged' : sharpness,
      motionValue,
      hitzoneEle,
      hitzoneRaw,
      uiElement,
      affinity,
      criticalBoost,
      criticalElement,
      miscRawMultiplier,
      rawMultipliers: [
        weaponType === 'Ranged' ? shotTypeUpSkill[shotTypeUp] : 0,
        weaponType === 'Ranged' ? rapidFireUpSkill[rapidFireUp] : 0,
        weaponType === 'Switch Axe' && saPhial === 'Power' ? 15 : 0,
      ],
      miscEleMultiplier,
      eleMultipliers: [
        weaponType === 'Ranged' ? rapidFireUpSkill[rapidFireUp] : 0,
        weaponType === 'Switch Axe' && saPhial === 'Element' ? 45 : 0,
      ],
      brutalStrike: rampageSkill === 'brutalStrike',
      dullingStrike: rampageSkill === 'dullingStrike',
      elementExploit: rampageSkill === 'elementExploit',
      mindsEye,
    })
  }, [
    weaponType,
    uiRaw,
    sharpness,
    motionValue,
    hitzoneEle,
    hitzoneRaw,
    uiElement,
    affinity,
    criticalBoost,
    criticalElement,
    miscRawMultiplier,
    miscEleMultiplier,
    rampageSkill,
    shotTypeUp,
    rapidFireUp,
    mindsEye,
    saPhial,
  ])

  return (
    <div className="main">
      <Box header="Weapon">
        <Dropdown
          label="Type"
          options={weapons}
          onChangeValue={(v) => setWeaponType(v as Weapon)}
        />
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
        {weaponType !== 'Ranged' && (
          <Dropdown
            options={Object.keys(sharpnessRawMultiplier).filter(
              (s) => s !== 'Ranged'
            )}
            label="Sharpness"
            placeholder="Sharpness"
            onChangeValue={(i) =>
              setSharpness(i as keyof typeof sharpnessRawMultiplier)
            }
          />
        )}
        <h4>{'Rampage Skills'}</h4>
        <Checkbox
          label="Brutal Strike"
          value={rampageSkill === 'brutalStrike'}
          onChangeValue={() => {
            if (rampageSkill === 'brutalStrike') setRampageSkill(undefined)
            else setRampageSkill('brutalStrike')
          }}
        />
        <Checkbox
          label="Dulling Strike"
          value={rampageSkill === 'dullingStrike'}
          onChangeValue={() => {
            if (rampageSkill === 'dullingStrike') setRampageSkill(undefined)
            else setRampageSkill('dullingStrike')
          }}
        />
        <Checkbox
          label="Element Exploit"
          value={rampageSkill === 'elementExploit'}
          onChangeValue={() => {
            if (rampageSkill === 'elementExploit') setRampageSkill(undefined)
            else setRampageSkill('elementExploit')
          }}
          note="if element hitzone >= 25"
        />
      </Box>
      <Box header="Skills">
        <Dropdown
          options={Object.keys(attackBoostSkill)}
          label="Attack Boost"
          value={attackBoost.toString()}
          onChangeValue={(v) => setAttackBoost(parseInt(v))}
        />
        <Dropdown
          options={Object.keys(elementalAttackSkill)}
          label="Element Attack"
          value={elementalAttack.toString()}
          onChangeValue={(v) => setElementalAttack(parseInt(v))}
        />
        <Dropdown
          options={Object.keys(criticalEyeSkill)}
          label="Critical Eye"
          value={criticalEye.toString()}
          onChangeValue={(v) => setCriticalEye(parseInt(v))}
        />
        <Dropdown
          options={Object.keys(weaknessExploitSkill)}
          label="Weakness Exploit"
          value={wex.toString()}
          onChangeValue={(v) => setWex(parseInt(v))}
          note="if raw hitzone >= 45"
        />
        <Dropdown
          options={Object.keys(criticalBoostSkill)}
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
        {weaponType === 'Ranged' ? (
          <>
            <Dropdown
              options={[0, 1, 2, 3]}
              label="Shot Type Up"
              value={shotTypeUp.toString()}
              onChangeValue={(v) => setShotTypeUp(parseInt(v))}
              note="e.g. Normal/Rapid Up, Pierce Up"
            />
            <Dropdown
              options={[0, 1, 2, 3]}
              label="Rapid Fire Up"
              value={rapidFireUp.toString()}
              onChangeValue={(v) => setRapidFireUp(parseInt(v))}
            />
          </>
        ) : (
          <>
            {renderBludgeoner}
            {renderMindsEye}
          </>
        )}
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
        <Dropdown
          label="Offensive Guard"
          options={[0, 1, 2, 3]}
          value={offensiveGuard.toString()}
          onChangeValue={(v) => setOffensiveGuard(parseInt(v))}
        />
        <Dropdown
          label="Peak Performance"
          options={[0, 1, 2, 3]}
          value={peakPerformance.toString()}
          onChangeValue={(v) => setPeakPerformance(parseInt(v))}
        />
        {renderCounterstrike}
        {renderHeroics}
      </Box>
      <Box header="Buffs">
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
          label="Dango Booster"
          value={dangoBooster}
          onChangeValue={setDangoBooster}
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
        <h4>{'Palico'}</h4>
        <Checkbox
          label="Power Drum"
          value={powerDrum}
          onChangeValue={setPowerDrum}
        />
        <Checkbox
          label="Rousing Roar"
          value={rousingRoar}
          onChangeValue={setRousingRoar}
        />
        {weaponType === 'Great Sword' && (
          <>
            <div style={{ height: '8px' }} />

            <h4>{'Great Sword'}</h4>
            <Checkbox
              label="Power Sheathe"
              value={powerSheathe}
              onChangeValue={setPowerSheathe}
            />
          </>
        )}
        {weaponType === 'Switch Axe' && (
          <>
            <div style={{ height: '8px' }} />
            <h4>{'Switch Axe'}</h4>
            <Checkbox
              label="Power Phial"
              value={saPhial === 'Power'}
              onChangeValue={() => {
                if (saPhial === 'Power') setSaPhial(undefined)
                else setSaPhial('Power')
              }}
            />
            <Checkbox
              label="Element Phial"
              value={saPhial === 'Element'}
              onChangeValue={() => {
                if (saPhial === 'Element') setSaPhial(undefined)
                else setSaPhial('Element')
              }}
            />
          </>
        )}
      </Box>
      <Box header="Misc">
        <NumberInput
          label="Misc. Attack Bonus (Flat)"
          value={miscAb}
          onChangeValue={setMiscAb}
          note="e.g. Petalace, Butterflame"
        />
        <NumberInput
          label="Misc. Attack Bonus (%)"
          value={rawModifierPercentage}
          onChangeValue={setRawModifierPercentage}
          note="e.g. Kinsect Buff"
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
          label="Raw Damage Multiplier (%)"
          value={miscRawMultiplier}
          onChangeValue={setMiscRawMultiplier}
          note="e.g. SA Power Phial"
        />
        <NumberInput
          label="Element Damage Multiplier (%)"
          value={miscEleMultiplier}
          onChangeValue={setMiscEleMultiplier}
          note="e.g. Greatsword Charge Attack"
        />
        <Checkbox
          label="Can't Crit"
          value={cannotCrit}
          onChangeValue={setCannotCrit}
          note="e.g. SA Phial Explosion"
        />
      </Box>
      <Box header="Attributes">
        <NumberInput label="Raw" value={toFixed(uiRaw)} disabled />
        <NumberInput label="Element" value={toFixed(uiElement)} disabled />
        <NumberInput label="Affinity (%)" value={affinity} disabled />
        {/* <NumberInput label="Effective Raw" value={toFixed(uiRaw)} disabled />
        <NumberInput
          label="Effective Element"
          value={toFixed(uiElement)}
          disabled
        /> */}
      </Box>
      <Box header="Damage">
        <h4>
          <strong>Average</strong>
        </h4>
        <NumberInput bold value={toFixed(average)} disabled />
        <div style={{ height: '8px' }} />
        <h4>Rounded Totals</h4>
        <div className="row">
          <NumberInput label="Hit" value={toFixed(hit)} disabled />
          <NumberInput label="Critical" value={toFixed(crit)} disabled />
        </div>
        {rampageSkill === 'brutalStrike' && (
          <NumberInput
            label="Brutal Strike"
            value={toFixed(brutalStrikeCrit)}
            disabled
          />
        )}
        {rampageSkill === 'dullingStrike' && (
          <div className="row">
            <NumberInput
              label="Dulling Hit"
              value={toFixed(dullingStrikeHit)}
              disabled
            />
            <NumberInput
              label="Dulling Critical"
              value={toFixed(dullingStrikeCrit)}
              disabled
            />
          </div>
        )}
        <div style={{ height: '8px' }} />
        <h4>Raw</h4>
        <div className="row">
          <NumberInput label="Hit" value={toFixed(rawHit)} disabled />
          <NumberInput label="Critical" value={toFixed(rawCrit)} disabled />
        </div>
        {rampageSkill === 'brutalStrike' && (
          <NumberInput
            label="Brutal Strike"
            value={toFixed(brutalStrikeRawCrit)}
            disabled
          />
        )}
        {rampageSkill === 'dullingStrike' && (
          <div className="row">
            <NumberInput
              label="Dulling Hit"
              value={toFixed(dullingStrikeRawHit)}
              disabled
            />
            <NumberInput
              label="Dulling Critical"
              value={toFixed(dullingStrikeRawCrit)}
              disabled
            />
          </div>
        )}
        <h4>Element</h4>
        <div className="row">
          <NumberInput label="Hit" value={toFixed(eleHit)} disabled />
          <NumberInput label="Critical" value={toFixed(eleCrit)} disabled />
        </div>
      </Box>
    </div>
  )
}
