import React from 'react'

type Props<T = string | number> = {
  options: T[]
  onChangeValue: (value: string) => void
  value?: string
  label?: string
  placeholder?: string
  note?: string
}

export default function Dropdown<T extends string | number>({
  options,
  onChangeValue,
  label,
  value,
  placeholder,
  note,
}: Props<T>) {
  return (
    <div className="dropdown">
      <label>{label}</label>
      <select onChange={(e) => onChangeValue(e.target.value)} value={value}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      {note && <label className="note">{note}</label>}
    </div>
  )
}
