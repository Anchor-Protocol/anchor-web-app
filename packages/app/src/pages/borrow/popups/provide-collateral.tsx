import React from 'react'
import Box from '../../../components/box'
import Button, { ButtonTypes } from '../../../components/button'
import Input from '../../../components/input'
import { PopupChild } from '../../../layout/popup-container'

interface PopupProvideCollateralProps extends PopupChild {
  
}

const PopupProvideCollateral: React.FunctionComponent<PopupProvideCollateralProps> = ({
  children,
}) => {
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
            <Input textRight="bATOM"/>
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

export default PopupProvideCollateral