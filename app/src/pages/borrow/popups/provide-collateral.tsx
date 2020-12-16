import { fabricateProvideCollateral } from '@anchor-protocol/anchor-js/fabricators';
import React, { useState } from 'react';
import Box from '../../../components/box';
import Button, { ButtonTypes } from '../../../components/button';
import Input from '../../../components/input';
import { ready } from '../../../components/ready';
import { ActionContainer } from '../../../containers/action';
import useBAssetBalance from '../../../hooks/mantle/use-basset-balance';
import { useWallet } from '../../../hooks/use-wallet';
import { PopupChild } from '../../../layout/popup-container';

interface PopupProvideCollateralProps extends PopupChild {}

const PopupProvideCollateral: React.FunctionComponent<PopupProvideCollateralProps> = ({
  close,
}) => {
  const { address } = useWallet();

  // side effects
  const [
    bAssetBalanceLoading,
    bAssetBalanceError,
    bAssetBalance,
  ] = useBAssetBalance();

  // input states
  const [depositState, setDepositState] = useState(0.0);

  // derived states
  const nextBorrowLimit = depositState * 123;

  const isReady = !bAssetBalanceLoading && !bAssetBalanceError;

  return ready(isReady, () => (
    <Box>
      <header>
        <dl>
          <dt>Provide Collateral</dt>
          <dd>Provide collateral to Anchor</dd>
        </dl>
      </header>
      <div>
        <section>
          <header>Deposit Amount</header>
          <div>
            <Input
              textRight="bLUNA"
              value={depositState}
              onChange={(next) => setDepositState(Number.parseFloat(next))}
            />
          </div>
          <footer>Wallet: {bAssetBalance.balance}bLUNA</footer>
        </section>
        <section>
          <header>New Borrow Limit</header>
          <div>
            <Input textRight="UST" value={nextBorrowLimit} disabled={true} />
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
              disabled={depositState > 0.0}
              onClick={() =>
                execute(
                  fabricateProvideCollateral({
                    address,
                    market: 'ust',
                    symbol: 'ust',
                    amount: depositState,
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
  ));
};

export default PopupProvideCollateral;
