import React from 'react'

type Props = {
  options: (string | number)[]
  onChangeValue: (value: string) => void
  value?: string
  label?: string
  placeholder?: string
}

export default function Dropdown({ options, onChangeValue, label, value, placeholder }: Props) {
  return (
    <div className="dropdown">
      <label>{label}</label>
      <select onChange={(e) => onChangeValue(e.target.value)} value={value}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}
