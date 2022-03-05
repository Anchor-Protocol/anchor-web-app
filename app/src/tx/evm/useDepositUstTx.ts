import { StreamReturn } from '@rx-stream/react';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { EvmChainId, useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { ContractReceipt } from 'ethers';
import { CrossChainTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { useRedeemableTx } from './useRedeemableTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { UST } from '@libs/types';
import { TxEventHandler } from './useTx';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface DepositUstTxProps {
  depositAmount: string;
}

export function useDepositUstTx():
  | StreamReturn<DepositUstTxProps, TxRender>
  | [null, null] {
  const {
    address,
    connection,
    connectType,
    chainId = EvmChainId.ETHEREUM_ROPSTEN,
  } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const {
    ust: { microfy, formatInput, formatOutput },
  } = useFormatters();

  const depositTx = useCallback(
    async (
      txParams: DepositUstTxProps,
      renderTxResults: Subject<TxRender>,
      handleEvent: TxEventHandler<DepositUstTxProps>,
    ) => {
      const depositAmount = microfy(
        formatInput(txParams.depositAmount),
      ).toString();

      await xAnchor.approveLimit(
        { token: 'ust' },
        depositAmount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          renderTxResults.next(
            txResult(event, connectType, chainId, 'deposit'),
          );
          handleEvent(event, txParams);
        },
      );

      return xAnchor.depositStable(
        depositAmount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          console.log(event, 'eventEmitted');

          renderTxResults.next(
            txResult(event, connectType, chainId, 'deposit'),
          );
          handleEvent(event, txParams);
        },
      );
    },
    [address, connectType, xAnchor, chainId, microfy, formatInput],
  );

  const depositTxStream = useRedeemableTx(
    depositTx,
    (resp) => resp.tx,
    null,
    (txParams) => ({
      action: 'depositStable',
      amount: `${formatOutput(txParams.depositAmount as UST)} UST`,
    }),
  );

  return chainId && connection && address ? depositTxStream : [null, null];
}
