import React, { useState } from 'react';
import { fabricateDepositStableCoin } from '@anchor-protocol/anchor-js/fabricators';
import Box from '../../../components/box';
import Button, { ButtonTypes } from '../../../components/button';
import Input from '../../../components/input';
import { ready } from '../../../components/ready';
import { ActionContainer } from '../../../containers/action';
import useWalletBalance from '../../../hooks/mantle/use-wallet-balance';
import { useWallet } from '../../../hooks/use-wallet';
import { PopupChild } from '../../../layout/popup-container';

interface EarnDepositPopupProps extends PopupChild {}

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
        // big fat arrow //
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
        <a>Deposit from bank</a>
      </footer>
    </Box>
  ));
};

export default EarnDepositPopup;
