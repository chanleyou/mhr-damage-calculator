import React from 'react'

type Props = {
  value?: number
  onChangeValue?: (v: number) => void
  label?: string
  disabled?: boolean
  note?: string
  bold?: boolean
}

export default function NumberInput({
  label,
  value,
  onChangeValue,
  disabled,
  note,
  bold,
}: Props) {
  return (
    <div className="number-input">
      <label>{label}</label>
      <input
        style={{ fontWeight: bold ? 'bold' : 'normal' }}
        type="number"
        value={value}
        onChange={(e) => {
          if (!onChangeValue) return
          const { value } = e.target
          switch (value) {
            case '':
              onChangeValue(0)
              break
            default:
              onChangeValue(parseInt(value))
          }
        }}
        disabled={disabled}
      />
      {note && <label className="note">{note}</label>}
    </div>
  )
}
