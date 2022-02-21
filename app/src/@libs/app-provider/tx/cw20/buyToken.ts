import { cw20BuyTokenTx } from '@libs/app-fns';
import { useFixedFee } from '@libs/app-provider/hooks/useFixedFee';
import { formatExecuteMsgNumber } from '@libs/formatter';
import { HumanAddr, Rate, Token, u, UST } from '@libs/types';
import { useConnectedWallet } from '@terra-money/use-wallet';
import big from 'big.js';
import { useCallback } from 'react';
import { useAccount } from 'contexts/account';
import { useApp } from '../../contexts/app';
import { TERRA_TX_KEYS } from '../../env';
import { useRefetchQueries } from '../../hooks/useRefetchQueries';
import { useUstTax } from '../../queries/terra/tax';
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
  const { availablePost, connected } = useAccount();

  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, constants } = useApp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const { taxRate, maxTax } = useUstTax();

  const { data: { terraswapPool } = {} } =
    useTerraswapPoolQuery<Token>(tokenUstPairAddr);

  const stream = useCallback(
    ({ buyAmount, txFee, maxSpread, onTxSucceed }: CW20BuyTokenTxParams) => {
      if (!availablePost || !connected || !connectedWallet || !terraswapPool) {
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
        taxRate,
        maxTaxUUSD: maxTax,
        maxSpread,
        buyerAddr: connectedWallet.walletAddress,
        fixedFee,
        gasWanted: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        queryClient,
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
      availablePost,
      connected,
      connectedWallet,
      terraswapPool,
      tokenUstPairAddr,
      tokenSymbol,
      taxRate,
      maxTax,
      fixedFee,
      constants.gasWanted,
      constants.gasAdjustment,
      queryClient,
      txErrorReporter,
      refetchQueries,
    ],
  );

  return connectedWallet ? stream : null;
}
