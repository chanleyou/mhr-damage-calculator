import React, { useState } from 'react'

type Props<T> = {
  skill: T[]
  label?: string
  note?: string
}

export default function Dropdown<T>({ skill, label, note }: Props<T>) {
  const options = Object.keys(skill)

  const [value, setValue] = useState(parseInt(options[0]))

  return [
    value,
    <div className="dropdown">
      <label>{label}</label>
      <select
        onChange={(e) => setValue(parseInt(e.target.value))}
        value={value}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      {note && <label className="note">{note}</label>}
    </div>,
  ] as const
}
