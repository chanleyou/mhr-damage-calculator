import React from 'react'

type Props = {
  value?: boolean
  onChangeValue: (v: boolean) => void
  label?: string
  disabled?: boolean
  note?: string
}

export default function Checkbox({
  value,
  onChangeValue,
  label,
  disabled,
  note,
}: Props) {
  return (
    <div className="checkbox">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChangeValue(e.target.checked)}
        disabled={disabled}
      />
      <label>{label}</label>
    </div>
  )
}
