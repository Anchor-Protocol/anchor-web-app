import React from 'react'
import Box from '../../components/box'
import Button, { ButtonTypes } from '../../components/button'
import BassetInput from './components/basset-input'
import BassetSelection, { Selections } from './components/selection'

interface BassetBurnProps {

}

const BassetBurn: React.FunctionComponent<BassetBurnProps> = ({
  children,
}) => {
  return (
    <div>
      <BassetSelection selection={Selections.BURN} />
      <article>
        <Box>
          <BassetInput
            caption="I want to burn"
            offerDenom="bLuna"
            askDenom="Luna"
            exchangeRate={0.99}
            amount={200.00}
            allowed={true}
          />
        </Box>
        <Box>
          <BassetInput
            caption="... and get"
            offerDenom="Luna"
            askDenom="bLuna"
            exchangeRate={1.01}
            amount={200.00}
            allowed={false}
          />
        </Box>
        {/* center arrow */}
        <aside>
          ~
        </aside>
      </article>

      <footer>
        <Button type={ButtonTypes.PRIMARY} transactional={true}>Burn</Button>
      </footer>
    </div>
  )
}

export default BassetBurn
