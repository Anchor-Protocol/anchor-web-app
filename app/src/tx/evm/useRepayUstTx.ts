import { StreamReturn } from '@rx-stream/react';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { CrossChainTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { useRedeemableTx } from './useRedeemableTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface RepayUstTxProps {
  amount: string;
}

export function useRepayUstTx():
  | StreamReturn<RepayUstTxProps, TxRender>
  | [null, null] {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const {
    ust: { microfy, formatInput },
  } = useFormatters();

  const repayTx = useCallback(
    async (txParams: RepayUstTxProps, renderTxResults: Subject<TxRender>) => {
      const amount = microfy(formatInput(txParams.amount)).toString();

      await xAnchor.approveLimit(
        'ust',
        amount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          renderTxResults.next(txResult(event, connectType, chainId!, 'repay'));
        },
      );

      return xAnchor.repayStable(amount, address!, TX_GAS_LIMIT, (event) => {
        console.log(event, 'eventEmitted ');

        renderTxResults.next(txResult(event, connectType, chainId!, 'repay'));
      });
    },
    [xAnchor, address, connectType, chainId, formatInput, microfy],
  );

  const repayTxStream = useRedeemableTx(repayTx, (resp) => resp.tx, null);

  return chainId && connection && address ? repayTxStream : [null, null];
}
