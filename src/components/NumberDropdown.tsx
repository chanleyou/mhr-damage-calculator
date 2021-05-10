import React, { useState } from 'react'
import { Dropdown } from '.'

type Props<T> = {
  skill: T[]
  label?: string
  note?: string
}

export default function useNumberDropdown<T>({ skill, label, note }: Props<T>) {
  const options = Object.keys(skill)
  const [value, setValue] = useState(parseInt(options[0]))

  return [
    value,
    <Dropdown
      label={label}
      options={options}
      onChangeValue={(v) => setValue(parseInt(v))}
      note={note}
    />,
  ] as const
}
