import React from 'react'
import Box from '../../components/box'
import Button, { ButtonTypes } from '../../components/button'
import BassetInput from './components/basset-input'
import BassetSelection, { Selections } from './components/selection'

interface BassetMintProps {
  
}

const BassetMint: React.FunctionComponent<BassetMintProps> = ({
  children,
}) => {
  return (
    <div>
      <BassetSelection selection={Selections.MINT}/>
      <article>
        <Box>
          <BassetInput
            caption="I want to bond"
            offerDenom="Luna"
            askDenom="bLuna"
            exchangeRate={1.01}
            amount={200.00}
            allowed={true}
          />
        </Box>
        <Box>
          <BassetInput
            caption="... and mint"
            offerDenom="bLuna"
            askDenom="Luna"
            exchangeRate={0.99}
            amount={200.00}
            allowed={false}
          />
        </Box>
        {/* center arrow */}
        <aside>
          ~
        </aside>

        {/* Validator selection */}
        <select>
          <option disabled={true}>Select Validator</option>
          <option>Paradise Jesse</option>
        </select>
      </article>

      <footer>
        <Button type={ButtonTypes.PRIMARY} transactional={true}>Mint</Button>
      </footer>
    </div>
  )
}

export default BassetMint
