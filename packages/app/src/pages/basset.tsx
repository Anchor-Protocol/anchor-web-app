import React from 'react'
import BassetBurn from './basset/burn'
import BassetClaim from './basset/claim'
import BassetMint from './basset/mint'

interface BassetProps {
  currentRoute: string
}

const Basset: React.FunctionComponent<BassetProps> = ({
  children,
}) => {
  return (
    <main>
      <BassetMint/>
      {/* <BassetBurn/> */}
      {/* <BassetClaim/> */}
    </main>
  )
}

export default Basset