import React from 'react'
import Amount from '../../components/amount'
import Box from '../../components/box'
import Button, { ButtonTypes } from '../../components/button'
import PopupContainer from '../../layout/popup-container'

interface BassetClaimProps {
  
}

const BassetClaim: React.FunctionComponent<BassetClaimProps> = ({
  children,
}) => {
  return (
    <div>
      <Box>
        <header>Available Luna</header>
        <div>
          <Amount amount={0.00} denom="Luna" />
        </div>
        <footer>
          <Button type={ButtonTypes.PRIMARY} transactional={true}>Withdraw</Button>
        </footer>
      </Box>
      <Box>
        <header>Claimable Rewards</header>
        <div>
          <Amount amount={0.00} denom="UST" />
        </div>
        <footer>
          <Button type={ButtonTypes.PRIMARY} transactional={true}>Claim</Button>
        </footer>
      </Box>

      <PopupContainer onClose={() => void 0}>
        {close => <div/>}
      </PopupContainer>
    </div>
  )
}

export default BassetClaim