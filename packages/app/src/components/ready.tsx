import React from 'react'

export const ready = (condition: boolean, render: () => React.ReactElement) => (
  !condition
    ? <div>Loading...</div>
    : render()
)