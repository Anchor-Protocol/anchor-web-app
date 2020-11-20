import React, { useState } from 'react'
import { fabricateProvideCollateral } from '../../../anchor-js/fabricators'
import Box from '../../../components/box'
import Button, { ButtonTypes } from '../../../components/button'
import Input from '../../../components/input'
import { ActionContainer } from '../../../containers/action'
import { useWallet } from '../../../hooks/use-wallet'
import { PopupChild } from '../../../layout/popup-container'

interface PopupProvideCollateralProps extends PopupChild {
  
}

const PopupProvideCollateral: React.FunctionComponent<PopupProvideCollateralProps> = ({
  close,
}) => {
  const { address } = useWallet()
  const [depositState, setDepositState] = useState(0.00)

  return (
    <Box>
      <header>
        <dl>
          <dt>Provide Collateral</dt>
          <dd>Provide collateral to Anchor</dd>
        </dl>
      </header>
      <div>
        <section>
          <header>
            Deposit Amount
          </header>
          <div>
            <Input
              textRight="bLUNA"
              value={depositState}
              onChange={next => setDepositState(Number.parseFloat(next))}
            />
          </div>
          <footer>
            Wallet: 234bATOM
          </footer>
        </section>
        <section>
          <header>
            New Borrow Limit
          </header>
          <div>
            <Input
              textRight="UST"
              value={0.00}
              disabled={true}
            />
          </div>
        </section>

        {/* indicator */}
        indicator
      </div>

      <footer>
        <ActionContainer render={execute => (
          <Button
            type={ButtonTypes.PRIMARY}
            disabled={depositState > 0.00}
            onClick={() => execute(fabricateProvideCollateral({
              address,
              market: 'ust',
              symbol: 'ust',
              amount: depositState
            })).then(close)}
          >Proceed</Button>
        )}/>
      </footer>
    </Box>
  )
}

export default PopupProvideCollateral