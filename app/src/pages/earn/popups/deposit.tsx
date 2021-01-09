import React, { useState } from 'react';
import { fabricateDepositStableCoin } from '@anchor-protocol/anchor-js/fabricators';
import Box from 'deprecated/components/box';
import Button, { ButtonTypes } from 'deprecated/components/button';
import Input from 'deprecated/components/input';
import { ready } from 'deprecated/components/ready';
import { ActionContainer } from '../../../deprecated/containers/action';
import useWalletBalance from '../../../deprecated/hooks/mantle/use-wallet-balance';
import { useWallet } from '../../../deprecated/hooks/use-wallet';
import { PopupChild } from '../../../deprecated/layout/popup-container';

interface EarnDepositPopupProps extends PopupChild {}

/** @deprecated */
const EarnDepositPopup: React.FunctionComponent<EarnDepositPopupProps> = ({
  close,
}) => {
  const { address } = useWallet();
  const [depositState, setDepositState] = useState(0.0);
  const [loading, error, balance] = useWalletBalance();

  // UST balance

  const ustBalance = balance?.find((e) => e.Denom === 'uusd')?.Amount || '0';
  const isReady = !loading && !error;

  return ready(isReady, () => (
    <Box>
      <header>
        {/* big fat arrow */}
        <dl>
          <dt>DEPOSIT</dt>
          <dd>Deposit UST into anchor</dd>
        </dl>
        <p>DEPOSIT</p>
      </header>

      <div>
        <div>
          <Input
            textRight="UST"
            value={depositState}
            onChange={(next) => setDepositState(Number.parseFloat(next))}
          />
        </div>
        <aside>
          Wallet: <span>{+ustBalance / 1000000} UST</span>
        </aside>
      </div>

      <footer>
        <ActionContainer
          render={(execute) => (
            <Button
              type={ButtonTypes.PRIMARY}
              disabled={depositState > 0.0}
              onClick={() =>
                execute(
                  fabricateDepositStableCoin({
                    address,
                    amount: depositState,
                    symbol: 'usd',
                  }),
                )
                  .then(close)
                  .catch(console.log)
              }
            >
              PROCEED
            </Button>
          )}
        />
        <button>Deposit from bank</button>
      </footer>
    </Box>
  ));
};

export default EarnDepositPopup;
