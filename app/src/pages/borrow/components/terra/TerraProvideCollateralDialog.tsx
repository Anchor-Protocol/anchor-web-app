import React from 'react';
import {
  useBorrowProvideCollateralForm,
  useBorrowProvideCollateralTx,
} from '@anchor-protocol/app-provider';
import { bAsset, CW20Addr } from '@anchor-protocol/types';
import { useCW20Balance } from '@libs/app-provider';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import type { DialogProps } from '@libs/use-dialog';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { ProvideCollateralDialog } from '../ProvideCollateralDialog';
import { ProvideCollateralFormParams } from '../types';

export const TerraProvideCollateralDialog = (
  props: DialogProps<ProvideCollateralFormParams>,
) => {
  const {
    collateralToken,
    token,
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
  } = props;

  const { availablePost, connected, terraWalletAddress } = useAccount();

  const uTokenBalance = useCW20Balance<bAsset>(
    token as CW20Addr,
    terraWalletAddress,
  );

  const states = useBorrowProvideCollateralForm(
    collateralToken,
    uTokenBalance,
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
  );

  const [postTx, txResult] = useBorrowProvideCollateralTx(collateralToken);

  const proceed = useCallback(
    (depositAmount: bAsset) => {
      if (!connected || !postTx) {
        return;
      }
      postTx({
        depositAmount,
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
