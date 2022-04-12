import { CrossChainEventHandler } from '@anchor-protocol/crossanchor-sdk';
import { useEvmWallet } from '@libs/evm-wallet';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { ContractReceipt } from 'ethers';
import { useCallback } from 'react';
import { useBackgroundTx } from './useBackgroundTx';
import { TxKind, TX_GAS_LIMIT } from './utils';

export interface WithdrawAssetsTxParams {
  tokenContract: string;
  amount: string;
  symbol: string;
}

export const useWithdrawAssetsTx = () => {
  const { provider, address, connectionType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();

  const withdrawTx = useCallback(
    async (
      txParams: WithdrawAssetsTxParams,
      handleEvent: CrossChainEventHandler<ContractReceipt>,
    ) => {
      try {
        const result = await xAnchor.withdrawAssets(
          { contract: txParams.tokenContract },
          address!,
          TX_GAS_LIMIT,
          (event) => {
            handleEvent(event);
          },
        );
        return result;
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    },
    [xAnchor, address],
  );

  const withdrawAssetsTx = useBackgroundTx<WithdrawAssetsTxParams>(
    withdrawTx,
    displayTx,
  );

  return provider && connectionType && chainId && address
    ? withdrawAssetsTx
    : undefined;
};

const displayTx = (txParams: WithdrawAssetsTxParams) => ({
  txKind: TxKind.WithdrawAssets,
  amount: `${txParams.amount} ${txParams.symbol}`,
  timestamp: Date.now(),
});
