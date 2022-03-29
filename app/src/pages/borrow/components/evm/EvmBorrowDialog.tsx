import React, { useEffect, useState, useMemo } from 'react';
import {
  CollateralAmount,
  CW20Addr,
  ERC20Addr,
  u,
  UST,
} from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { BorrowDialog } from '../BorrowDialog';
import { BorrowFormParams } from '../types';
import { useBorrowUstTx } from 'tx/evm';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { microfy, useFormatters } from '@anchor-protocol/formatter';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { EvmCrossAnchorSdk } from '@anchor-protocol/crossanchor-sdk';
import Big from 'big.js';
import { WhitelistCollateral } from 'queries';

interface ERC20Token {
  address: ERC20Addr;
  symbol: string;
  decimals: number;
  balance: u<CollateralAmount>;
}

const fetchERC20Token = async (
  sdk: EvmCrossAnchorSdk,
  address: ERC20Addr,
): Promise<ERC20Token> => {
  const decimals = await sdk.decimals(address);
  const symbol = await sdk.symbol(address);

  // TODO: add the balance
  //const balance = await sdk.balance(address);

  return {
    address,
    decimals,
    symbol,
    balance: '0' as u<CollateralAmount>,
  };
};

const useERC20Token = (address: ERC20Addr): ERC20Token | undefined => {
  const sdk = useEvmCrossAnchorSdk();

  const [erc20, setERC20] = useState<ERC20Token | undefined>(undefined);

  useEffect(() => {
    fetchERC20Token(sdk, address).then((erc20) => setERC20(erc20));
  }, [sdk, address]);

  return erc20;
};

export const EvmBorrowDialog = (props: DialogProps<BorrowFormParams>) => {
  const { connected } = useAccount();

  const { ust } = useFormatters();

  const borrowUstTx = useBorrowUstTx();
  const { isTxMinimizable, minimize } = borrowUstTx?.utils ?? {};
  const [postBorrowUstTx, borrowUstTxResult] = borrowUstTx?.stream ?? [
    null,
    null,
  ];

  // TODO: need to look this up
  const erc20Token = useERC20Token(
    '0x6190e33FF30f3761Ce544ce539d69dDcD6aDF5eC' as ERC20Addr,
  );

  const [collateral, setCollateral] = useState<
    WhitelistCollateral | undefined
  >();

  const maxCollateralAmount = useMemo(() => {
    if (collateral === undefined) {
      return Big(0) as u<CollateralAmount<Big>>;
    }
    if (collateral.symbol === 'bLuna') {
      return Big(1000000) as u<CollateralAmount<Big>>;
    }
    if (collateral.symbol === 'bETH') {
      return Big(2000000) as u<CollateralAmount<Big>>;
    }
    return Big(3000000) as u<CollateralAmount<Big>>;
  }, [collateral]);

  console.log('maxCollateralAmount', maxCollateralAmount.toString());

  const proceed = useCallback(
    (
      amount: UST,
      txFee: u<UST>,
      collateral?: CW20Addr,
      collateralAmount?: u<CollateralAmount<Big>>,
    ) => {
      if (connected && postBorrowUstTx) {
        const borrowAmount = ust.microfy(ust.formatInput(amount));

        // TODO: need to validate that the ERC20 token has loaded before the proceed button can be executed

        if (
          collateral &&
          collateralAmount &&
          collateralAmount.gt(0) &&
          erc20Token
        ) {
          postBorrowUstTx({
            borrowAmount,
            collateralToken: collateral,
            collateralAmount: collateralAmount
              ? (Big(microfy(Big(collateralAmount), erc20Token.decimals)) as u<
                  CollateralAmount<Big>
                >)
              : (Big(0) as u<CollateralAmount<Big>>),
            erc20ContractAddress: erc20Token.address,
            erc20Symbol: erc20Token.symbol,
          });

          return;
        }

        postBorrowUstTx({ borrowAmount });
      }
    },
    [postBorrowUstTx, connected, erc20Token, ust],
  );

  return (
    <BorrowDialog
      {...props}
      collateral={collateral}
      onCollateralChange={setCollateral}
      maxCollateralAmount={maxCollateralAmount}
      txResult={borrowUstTxResult}
      proceedable={postBorrowUstTx !== undefined}
      onProceed={proceed}
      renderBroadcastTxResult={({ txResult, closeDialog }) => (
        <TxResultRenderer
          onExit={closeDialog}
          resultRendering={txResult.value}
          minimizable={isTxMinimizable}
          onMinimize={minimize}
        />
      )}
    />
  );
};
