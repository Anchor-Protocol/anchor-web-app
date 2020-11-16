import React from 'react'
import Box from '../../../components/box'
import Button, { ButtonTypes } from '../../../components/button'
import Input from '../../../components/input'
import { PopupChild } from '../../../layout/popup-container'

interface PopupRedeemCollateralProps extends PopupChild {

}

const PopupRedeemCollateral: React.FunctionComponent<PopupRedeemCollateralProps> = ({
  children,
}) => {
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
            <Input textRight="bLUNA" />
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
            <Input textRight="UST" />
          </div>
        </section>

        {/* indicator */}
        indicator
      </div>

      <footer>
        <Button type={ButtonTypes.PRIMARY} disabled={true}>Proceed</Button>
      </footer>
    </Box>
  )
}

export default PopupRedeemCollateral