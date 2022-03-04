import React from 'react';
import { useBorrowProvideCollateralForm } from '@anchor-protocol/app-provider';
import { bAsset, ERC20Addr } from '@anchor-protocol/types';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import type { DialogProps } from '@libs/use-dialog';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { useProvideCollateralTx } from 'tx/evm';
import { ProvideCollateralDialog } from '../ProvideCollateralDialog';
import { ProvideCollateralFormParams } from '../types';
import { useERC20Balance } from '@libs/app-provider/queries/erc20/balanceOf';

export const EvmProvideCollateralDialog = (
  props: DialogProps<ProvideCollateralFormParams>,
) => {
  const {
    collateralToken,
    token,
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
  } = props;

  const { availablePost, connected } = useAccount();

  const uTokenBalance = useERC20Balance<bAsset>(token as ERC20Addr);

  const states = useBorrowProvideCollateralForm(
    collateralToken,
    uTokenBalance,
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
  );

  const [postTx, txResult] = useProvideCollateralTx();

  const proceed = useCallback(
    (amount: bAsset) => {
      if (!connected || !postTx) {
        return;
      }
      postTx({
        collateral: 'bluna', //states.collateral,
        amount,
      });
    },
    [connected, postTx],
  );

  return (
    <ProvideCollateralDialog {...props} {...states} txResult={txResult}>
      <ViewAddressWarning>
        <ActionButton
          className="proceed"
          disabled={
            !availablePost || !connected || !postTx || !states.availablePost
          }
          onClick={() => proceed(states.depositAmount)}
        >
          Proceed
        </ActionButton>
      </ViewAddressWarning>
    </ProvideCollateralDialog>
  );
};
