import { ANCHOR_QUERY_KEY } from '@anchor-protocol/app-provider';
import { CW20Addr, Token, u } from '@libs/types';
import Big, { BigSource } from 'big.js';
import { useQuery } from 'react-query';
import { sum } from '@libs/big-math';

const rawCollateral = [
  {
    tokenAddress: 'terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp',
    symbol: 'bLuna',
    name: 'Bonded Luna',
    icon: 'https://whitelist.anchorprotocol.com/logo/bLUNA.png',
    votes: Big('826789069442123') as u<Token<BigSource>>,
  },
  {
    tokenAddress: 'terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun',
    symbol: 'bETH',
    name: 'Bonded ETH',
    icon: 'https://whitelist.anchorprotocol.com/logo/bETH.png',
    votes: Big('132789069442123') as u<Token<BigSource>>,
  },
  {
    tokenAddress: 'terra18zqcnl83z98tf6lly37gghm7238k7lh79u4z9a',
    symbol: 'bATOM',
    name: 'Bonded ATOM',
    icon: 'https://files.pstake.finance/logos/bAssets/bATOM.svg',
    votes: Big('211789069442123') as u<Token<BigSource>>,
  },
  {
    tokenAddress: 'terra1z3e2e4jpk4n0xzzwlkgcfvc95pc5ldq0xcny58',
    symbol: 'wasAVAX',
    name: 'BENQI Staked AVAX (Portal)',
    icon: 'https://benqi.fi/images/assets/savax.svg',
    votes: Big('111189069442123') as u<Token<BigSource>>,
  },
];

export interface GaugeCollateral {
  tokenAddress: CW20Addr;
  symbol: string;
  name: string;
  icon: string;
  votes: u<Token<BigSource>>;
  share: number;
}

export const useCollateralGaugesQuery = () => {
  return useQuery(
    [ANCHOR_QUERY_KEY.GAUGES],
    () => {
      const totalVotes = sum(...rawCollateral.map((c) => c.votes));

      const collateral = rawCollateral.map((collateral) => ({
        ...collateral,
        share: Big(collateral.votes).div(totalVotes).toNumber(),
      }));

      return {
        collateral,
        totalVotes,
      };
    },
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
    },
  );
};
