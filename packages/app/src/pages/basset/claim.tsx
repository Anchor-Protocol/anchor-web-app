import React from 'react'
import Amount from '../../components/amount'
import Box from '../../components/box'
import Button, { ButtonTypes } from '../../components/button'
import PopupContainer from '../../layout/popup-container'

import style from './basset.module.css'
import BassetSelection from './components/selection'

interface BassetClaimProps {
  
}

const BassetClaim: React.FunctionComponent<BassetClaimProps> = ({
  children,
}) => {
  return (
    <div className={style['basset-container']}>
      <BassetSelection/>
      <article className={style.business}>
        <Box>
          <header>Available Luna</header>
          <div>
            <Amount amount={10000000000} denom="Luna" />
          </div>
          <footer>
            <Button type={ButtonTypes.PRIMARY} transactional={true}>Withdraw</Button>
          </footer>
        </Box>
        <Box>
          <header>Claimable Rewards</header>
          <div>
            <Amount amount={2444444444} denom="UST" />
          </div>
          <footer>
            <Button type={ButtonTypes.PRIMARY} transactional={true}>Claim</Button>
          </footer>
        </Box>
      </article>

      <PopupContainer onClose={() => void 0}>
        {close => <div/>}
      </PopupContainer>
    </div>
  )
}

export default BassetClaim