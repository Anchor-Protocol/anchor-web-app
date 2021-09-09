import { formatExecuteMsgNumber } from '@libs/formatter';
import { CW20Addr, HumanAddr, Rate, Token, u, UST } from '@libs/types';
import {
  cw20SellTokenTx,
  Tax,
  TERRA_TX_KEYS,
  TokenBalances,
} from '@libs/webapp-fns';
import {
  useBank,
  useRefetchQueries,
  useTerraWebapp,
} from '@libs/webapp-provider';
import { useConnectedWallet } from '@terra-dev/use-wallet';
import big from 'big.js';
import { useCallback } from 'react';
import { useTerraswapPoolQuery } from '../../queries/terraswap/pool';

export interface CW20SellTokenTxParams<T extends Token> {
  sellAmount: u<T>;
  txFee: u<UST>;
  maxSpread: Rate;

  onTxSucceed?: () => void;
}

export function useCW20SellTokenTx<T extends Token>(
  tokenAddr: CW20Addr,
  tokenUstPairAddr: HumanAddr,
  tokenSymbol: string,
) {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, txErrorReporter, constants } =
    useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const { tax } = useBank<TokenBalances, Tax>();

  const { data: { terraswapPool } = {} } =
    useTerraswapPoolQuery<Token>(tokenUstPairAddr);

  const stream = useCallback(
    ({
      sellAmount,
      txFee,
      maxSpread,
      onTxSucceed,
    }: CW20SellTokenTxParams<T>) => {
      if (
        !connectedWallet ||
        !connectedWallet.availablePost ||
        !terraswapPool
      ) {
        throw new Error(`Can't post!`);
      }

      const tokenPoolSize = terraswapPool.assets[0]?.amount as u<Token>;
      const ustPoolSize = terraswapPool.assets[1]?.amount as u<UST>;

      return cw20SellTokenTx<T>({
        txFee,
        sellAmount,
        beliefPrice: formatExecuteMsgNumber(
          big(tokenPoolSize).div(ustPoolSize),
        ) as T,
        tokenAddr,
        tokenUstPairAddr,
        tokenSymbol,
        tax,
        maxSpread,
        sellerAddr: connectedWallet.walletAddress,
        fixedGas: constants.fixedGas,
        gasFee: constants.gasFee,
        gasAdjustment: constants.gasAdjustment,
        mantleEndpoint,
        mantleFetch,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(TERRA_TX_KEYS.CW20_SELL);
        },
        network: connectedWallet.network,
        post: connectedWallet.post,
      });
    },
    [
      connectedWallet,
      constants.fixedGas,
      constants.gasAdjustment,
      constants.gasFee,
      mantleEndpoint,
      mantleFetch,
      refetchQueries,
      tax,
      terraswapPool,
      tokenAddr,
      tokenSymbol,
      tokenUstPairAddr,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
