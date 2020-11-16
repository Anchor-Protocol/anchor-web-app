import React from 'react'
import Box from '../../../components/box'
import Button, { ButtonTypes } from '../../../components/button'
import Input from '../../../components/input'
import { PopupChild } from '../../../layout/popup-container'

interface EarnWithdrawPopupProps extends PopupChild {

}

const EarnWithdrawPopup: React.FunctionComponent<EarnWithdrawPopupProps> = ({
  children,
}) => {
  return (
    <Box>
      <header>
        // big fat arrow //
        <dl>
          <dt>Withdraw</dt>
          <dd>Withdraw UST from anchor</dd>
        </dl>
      </header>

      <div>
        <div>
          <Input textRight="UST" />
        </div>
        <aside>
          Wallet: <span>8390.38 UST</span>
        </aside>
      </div>

      <footer>
        <Button type={ButtonTypes.PRIMARY} disabled={true}>PROCEED</Button>
        <a>Withdraw to bank</a>
      </footer>
    </Box>
  )
}

export default EarnWithdrawPopup