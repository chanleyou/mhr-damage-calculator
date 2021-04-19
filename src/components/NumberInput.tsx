import React from 'react'

type Props = {
  value?: number
  onChangeValue?: (v: number) => void
  label?: string
  disabled?: boolean
}

export default function NumberInput({ label, value, onChangeValue, disabled }: Props) {
  return (
    <div className="number-input">
      <label>{label}</label>
      <input
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
    </div>
  )
}
