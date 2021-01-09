import React, { useState } from 'react';
import { fabricateRedeemCollateral } from '@anchor-protocol/anchor-js/fabricators';
import Box from 'deprecated/components/box';
import Button, { ButtonTypes } from 'deprecated/components/button';
import Input from 'deprecated/components/input';
import { ActionContainer } from '../../../deprecated/containers/action';
import { useWallet } from '../../../deprecated/hooks/use-wallet';
import { PopupChild } from '../../../deprecated/layout/popup-container';

interface PopupRedeemCollateralProps extends PopupChild {}

const PopupRedeemCollateral: React.FunctionComponent<PopupRedeemCollateralProps> = ({
  close,
}) => {
  const { address } = useWallet();
  const [redeemState, setRedeemState] = useState(0.0);

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
          <header>Redeem Amount</header>
          <div>
            <Input
              textRight="bLUNA"
              value={redeemState}
              onChange={(next) => setRedeemState(Number.parseFloat(next))}
            />
          </div>
          <footer>Max: 234bLuna</footer>
        </section>
        <section>
          <header>New Borrow Limit</header>
          <div>
            <Input textRight="UST" disabled={true} value={0.0} />
          </div>
        </section>
        {/* indicator */}
        indicator
      </div>

      <footer>
        <ActionContainer
          render={(execute) => (
            <Button
              type={ButtonTypes.PRIMARY}
              disabled={true}
              onClick={() =>
                execute(
                  fabricateRedeemCollateral({
                    address,
                    market: 'ust',
                    amount: redeemState.toString(),
                  }),
                ).then(close)
              }
            >
              Proceed
            </Button>
          )}
        />
      </footer>
    </Box>
  );
};

export default PopupRedeemCollateral;
