import React, { useState } from 'react';
import { fabricateRedeemStable } from '@anchor-protocol/anchor-js/fabricators';
import Box from '../../../components/box';
import Button, { ButtonTypes } from '../../../components/button';
import Input from '../../../components/input';
import { ActionContainer } from '../../../containers/action';
import { useWallet } from '../../../hooks/use-wallet';
import { PopupChild } from '../../../layout/popup-container';

interface EarnWithdrawPopupProps extends PopupChild {}

const EarnWithdrawPopup: React.FunctionComponent<EarnWithdrawPopupProps> = ({
  close,
}) => {
  const { address } = useWallet();
  const [withdrawState, setWithdrawState] = useState(0.0);

  return (
    <Box>
      <header>
        {/* big fat arrow */}
        <dl>
          <dt>Withdraw</dt>
          <dd>Withdraw UST from anchor</dd>
        </dl>
      </header>

      <div>
        <div>
          <Input
            textRight="UST"
            value={withdrawState}
            onChange={(next) => setWithdrawState(Number.parseFloat(next))}
          />
        </div>
        <aside>
          Wallet: <span>8390.38 UST</span>
        </aside>
      </div>

      <footer>
        <ActionContainer
          render={(execute) => (
            <Button
              type={ButtonTypes.PRIMARY}
              disabled={true}
              onClick={() =>
                execute(
                  fabricateRedeemStable({
                    address,
                    symbol: 'usd',
                    amount: withdrawState,
                  }),
                ).then(close)
              }
            >
              PROCEED
            </Button>
          )}
        />
        <button>Withdraw to bank</button>
      </footer>
    </Box>
  );
};

export default EarnWithdrawPopup;
