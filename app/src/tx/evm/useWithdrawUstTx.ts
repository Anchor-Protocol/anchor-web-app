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
import { getAddress } from 'configurations/evm/addresses';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface WithdrawUstTxProps {
  withdrawAmount: string;
}

type UseWithdrawUstTxReturn =
  | StreamReturn<WithdrawUstTxProps, TxRender>
  | [null, null];

// export function useWithdrawUstTx(): UseWithdrawUstTxReturn {
//   const { address, connection, connectType } = useEvmWallet();
//   const evmSdk = useEvmCrossAnchorSdk();

//   const { aUST: { formatInput, microfy } } = useFormatters();

//   const withdrawTx = useCallback(
//     (txParams: WithdrawUstTxProps, renderTxResults: Subject<TxRender>) => {
//       const withdrawAmount = microfy(formatInput(txParams.withdrawAmount));
//       return evmSdk.redeemStable(
//         toWei(withdrawAmount),
//         address!,
//         TX_GAS_LIMIT,
//         (event) => {
//           renderTxResults.next(
//             txResult(event, connectType, 'ethereum', 'withdraw'),
//           );
//         },
//       );
//     },
//     [evmSdk, address, connectType],
//   );

//   const withdrawTxStream = useRedeemableTx(withdrawTx, (resp) => resp.tx, null);

//   return connection && address ? withdrawTxStream : [null, null];
// }

export function useWithdrawUstTx(): UseWithdrawUstTxReturn {
  const {
    address,
    connection,
    connectType,
    chainId = EvmChainId.ETHEREUM_ROPSTEN,
  } = useEvmWallet();

  const xAnchor = useEvmCrossAnchorSdk();

  const {
    aUST: { formatInput, microfy },
  } = useFormatters();

  const withdrawTx = useCallback(
    async (
      txParams: WithdrawUstTxProps,
      renderTxResults: Subject<TxRender>,
    ) => {
      const withdrawAmount = microfy(
        formatInput(txParams.withdrawAmount),
      ).toString();

      await xAnchor.approveLimit(
        getAddress(chainId, 'aUST'),
        address!,
        withdrawAmount,
        TX_GAS_LIMIT,
        (event) => {
          renderTxResults.next(
            txResult(event, connectType, 'ethereum', 'withdraw'),
          );
        },
      );

      return await xAnchor.redeemStable(
        withdrawAmount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          renderTxResults.next(
            txResult(event, connectType, 'ethereum', 'withdraw'),
          );
        },
      );
    },
    [xAnchor, address, connectType, formatInput, microfy, chainId],
  );

  const withdrawTxStream = useRedeemableTx(withdrawTx, (resp) => resp.tx, null);

  return connection && address ? withdrawTxStream : [null, null];
}
