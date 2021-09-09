import { formatExecuteMsgNumber } from '@libs/formatter';
import { HumanAddr, Rate, Token, u, UST } from '@libs/types';
import {
  cw20BuyTokenTx,
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

export interface CW20BuyTokenTxParams {
  buyAmount: u<UST>;
  txFee: u<UST>;
  maxSpread: Rate;

  onTxSucceed?: () => void;
}

export function useCW20BuyTokenTx(
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
    ({ buyAmount, txFee, maxSpread, onTxSucceed }: CW20BuyTokenTxParams) => {
      if (
        !connectedWallet ||
        !connectedWallet.availablePost ||
        !terraswapPool
      ) {
        throw new Error(`Can't post!`);
      }

      const tokenPoolSize = terraswapPool.assets[0]?.amount as u<Token>;
      const ustPoolSize = terraswapPool.assets[1]?.amount as u<UST>;

      return cw20BuyTokenTx({
        txFee,
        buyAmount,
        beliefPrice: formatExecuteMsgNumber(
          big(ustPoolSize).div(tokenPoolSize),
        ) as UST,
        tokenUstPairAddr,
        tokenSymbol,
        tax,
        maxSpread,
        buyerAddr: connectedWallet.walletAddress,
        fixedGas: constants.fixedGas,
        gasFee: constants.gasFee,
        gasAdjustment: constants.gasAdjustment,
        mantleEndpoint,
        mantleFetch,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(TERRA_TX_KEYS.CW20_BUY);
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
      tokenSymbol,
      tokenUstPairAddr,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
