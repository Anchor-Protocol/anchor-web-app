import React from 'react'
import Box from '../../../components/box'
import Button, { ButtonTypes } from '../../../components/button'
import Input from '../../../components/input'
import { PopupChild } from '../../../layout/popup-container'

interface EarnDepositPopupProps extends PopupChild {
  
}

const EarnDepositPopup: React.FunctionComponent<EarnDepositPopupProps> = ({
  children,
}) => {
  return (
    <Box>
      <header>
        // big fat arrow //
        <dl>
          <dt>DEPOSIT</dt>
          <dd>Deposit UST into anchor</dd>
        </dl>
        <p>
          DEPOSIT
        </p>
      </header>

      <div>
        <div>
          <Input textRight="UST"/>
        </div>
        <aside>
          Wallet: <span>8390.38 UST</span>
        </aside>
      </div>

      <footer>
        <Button type={ButtonTypes.PRIMARY} disabled={true}>PROCEED</Button>
        <a>Deposit from bank</a>
      </footer>
    </Box>
  )
}

export default EarnDepositPopup