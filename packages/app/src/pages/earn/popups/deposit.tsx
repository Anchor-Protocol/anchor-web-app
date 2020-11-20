import React, { useState } from 'react'
import { fabricateDepositStableCoin } from '../../../anchor-js/fabricators'
import Box from '../../../components/box'
import Button, { ButtonTypes } from '../../../components/button'
import Input from '../../../components/input'
import { ActionContainer } from '../../../containers/action'
import { useWallet } from '../../../hooks/use-wallet'
import { PopupChild } from '../../../layout/popup-container'

interface EarnDepositPopupProps extends PopupChild {
  
}

const EarnDepositPopup: React.FunctionComponent<EarnDepositPopupProps> = ({
  close,
}) => {
  const { address } = useWallet()
  const [depositState, setDepositState] = useState(0.00)

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
          <Input
            textRight="UST"
            value={depositState}
            onChange={next => setDepositState(Number.parseFloat(next))}
          />
        </div>
        <aside>
          Wallet: <span>8390.38 UST</span>
        </aside>
      </div>

      <footer>
        <ActionContainer render={execute => (
          <Button
            type={ButtonTypes.PRIMARY}
            disabled={depositState > 0.00}
            onClick={() => execute(fabricateDepositStableCoin({
              address,
              amount: depositState,
              symbol: "usd"
            })).then(close)}
          >PROCEED</Button>
        )}/>
        <a>Deposit from bank</a>
      </footer>
    </Box>
  )
}

export default EarnDepositPopup