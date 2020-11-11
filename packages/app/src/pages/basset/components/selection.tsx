import React from 'react'

export enum Selections {
  MINT,
  BURN,
  CLAIM,
}

interface BassetSelectionProps {
  selection: Selections
}

const BassetSelection: React.FunctionComponent<BassetSelectionProps> = ({
  selection,
}) => {
  return (
    <nav>
      <a>Mint</a>
      <a>Burn</a>
      <a>Claim</a>
    </nav>
  )
}

export default BassetSelection