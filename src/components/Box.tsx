import React from 'react'

type Props = {
  children?: React.ReactNode
  header?: string
  subheader?: string
}

export default function Box({ children, header, subheader }: Props) {
  return (
    <div className="box">
      {header && (
        <h1 style={subheader ? { marginBottom: 0 } : undefined}>{header}</h1>
      )}
      {subheader && <p className="subheader">{subheader}</p>}
      <div style={{ height: '6px' }} />
      {children}
    </div>
  )
}
