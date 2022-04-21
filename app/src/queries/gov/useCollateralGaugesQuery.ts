import { ANCHOR_QUERY_KEY } from '@anchor-protocol/app-provider';
import { Token, u } from '@libs/types';
import Big, { BigSource } from 'big.js';
import { useQuery } from 'react-query';
import { sum } from '@libs/big-math';

const rawCollateral = [
  {
    symbol: 'bLuna',
    name: 'Bonded Luna',
    votes: Big('6789069442123') as u<Token<BigSource>>,
  },
  {
    symbol: 'bETH',
    name: 'Bonded ETH',
    votes: Big('2789069442123') as u<Token<BigSource>>,
  },
  {
    symbol: 'bATOM',
    name: 'Bonded ATOM',
    votes: Big('1789069442123') as u<Token<BigSource>>,
  },
  {
    symbol: 'wasAVAX',
    name: 'BENQI Staked AVAX (Portal)',
    votes: Big('1189069442123') as u<Token<BigSource>>,
  },
];

export interface GaugeCollateral {
  symbol: string;
  name: string;
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
