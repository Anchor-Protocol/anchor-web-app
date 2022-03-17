import { bAssetImportTx } from '@anchor-protocol/app-fns';
import { bAsset } from '@anchor-protocol/types';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { CW20Addr } from '@libs/types';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';
import { useBAssetInfoByTokenAddrQuery } from '../../queries/basset/bAssetInfoByTokenAddr';

export interface BAssetImportTxParams {
  amount: bAsset;
  onTxSucceed?: () => void;
}

export function useBAssetImportTx(tokenAddr: CW20Addr | undefined) {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, constants } = useAnchorWebapp();

  const fixedFee = useFixedFee();

  const { data: bAssetInfo } = useBAssetInfoByTokenAddrQuery(tokenAddr);

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ onTxSucceed, amount }: BAssetImportTxParams) => {
      if (
        !connectedWallet ||
        !connectedWallet.availablePost ||
        !bAssetInfo ||
        !bAssetInfo.converterConfig.wormhole_token_address ||
        !bAssetInfo.wormholeTokenInfo
      ) {
        throw new Error('Can not post!');
      }

      return bAssetImportTx({
        walletAddr: connectedWallet.walletAddress,
        converterAddr: bAssetInfo.minter.minter,
        wormholeTokenAddr: bAssetInfo.converterConfig.wormhole_token_address,
        wormholeTokenAmount: amount,
        wormholeTokenInfo: bAssetInfo.wormholeTokenInfo,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: fixedFee,
        gasFee: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        bAssetInfo,
        // query
        queryClient,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.BASSET_IMPORT);
        },
      });
    },
    [
      connectedWallet,
      bAssetInfo,
      fixedFee,
      constants.gasWanted,
      constants.gasAdjustment,
      queryClient,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
