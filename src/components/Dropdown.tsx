import React from "react";

type Props = {
  options: (string | number)[];
  onChangeValue: (value: string) => void;
  value?: string;
  label?: string;
  placeholder?: string;
  note?: string;
};

export default function Dropdown({
  options,
  onChangeValue,
  label,
  value,
  placeholder,
  note,
}: Props) {
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
  );
}
