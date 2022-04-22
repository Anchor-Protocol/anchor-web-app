import { CrossChainEventHandler } from '@anchor-protocol/crossanchor-sdk';
import { useEvmWallet } from '@libs/evm-wallet';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { ContractReceipt } from 'ethers';
import { useCallback } from 'react';
import { useBackgroundTx } from './useBackgroundTx';
import { TxKind } from './utils';

export interface WithdrawAssetTxParams {
  tokenContract: string;
  amount: string;
  symbol: string;
}

export const useWithdrawAssetTx = () => {
  const { provider, address, connectionType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();

  const withdrawTx = useCallback(
    async (
      txParams: WithdrawAssetTxParams,
      handleEvent: CrossChainEventHandler<ContractReceipt>,
    ) => {
      try {
        const result = await xAnchor.withdrawAsset(
          { contract: txParams.tokenContract },
          address!,
          { handleEvent },
        );
        return result;
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    },
    [xAnchor, address],
  );

  const withdrawAssetTx = useBackgroundTx<WithdrawAssetTxParams>(
    withdrawTx,
    displayTx,
  );

  return provider && connectionType && chainId && address
    ? withdrawAssetTx
    : undefined;
};

const displayTx = (txParams: WithdrawAssetTxParams) => ({
  txKind: TxKind.WithdrawAsset,
  amount: `${txParams.amount} ${txParams.symbol}`,
  timestamp: Date.now(),
});
