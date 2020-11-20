import React, { useState } from 'react'
import { fabricateRedeemCollateral } from '../../../anchor-js/fabricators'
import Box from '../../../components/box'
import Button, { ButtonTypes } from '../../../components/button'
import Input from '../../../components/input'
import { ActionContainer } from '../../../containers/action'
import { useWallet } from '../../../hooks/use-wallet'
import { PopupChild } from '../../../layout/popup-container'

interface PopupRedeemCollateralProps extends PopupChild {

}

const PopupRedeemCollateral: React.FunctionComponent<PopupRedeemCollateralProps> = ({
  close,
}) => {
  const { address } = useWallet()
  const [redeemState, setRedeemState] = useState(0.00)

  return (
    <Box>
      <header>
        <dl>
          <dt>Redeem Collateral</dt>
          <dd>Redeem collateral from Anchor</dd>
        </dl>
      </header>
      <div>
        <section>
          <header>
            Redeem Amount
          </header>
          <div>
            <Input
              textRight="bLUNA" 
              value={redeemState}
              onChange={next => setRedeemState(Number.parseFloat(next))}
            />
          </div>
          <footer>
            Max: 234bLuna
          </footer>
        </section>
        <section>
          <header>
            New Borrow Limit
          </header>
          <div>
            <Input
              textRight="UST"
              disabled={true}
              value={0.00}
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
            disabled={true}
            onClick={() => execute(fabricateRedeemCollateral({
              address,
              market: 'ust',
              redeem_all: false,
              amount: redeemState,
            })).then(close)}
          >Proceed</Button>
        )}/>
      </footer>
    </Box>
  )
}

export default PopupRedeemCollateral