import { ANCHOR_QUERY_KEY } from '@anchor-protocol/app-provider';
import { Token, u } from '@libs/types';
import Big, { BigSource } from 'big.js';
import { useQuery } from 'react-query';
import { sum } from '@libs/big-math';

const rawCollateral = [
  {
    symbol: 'bLuna',
    name: 'Bonded Luna',
    icon: 'https://whitelist.anchorprotocol.com/logo/bLUNA.png',
    votes: Big('826789069442123') as u<Token<BigSource>>,
  },
  {
    symbol: 'bETH',
    name: 'Bonded ETH',
    icon: 'https://whitelist.anchorprotocol.com/logo/bETH.png',
    votes: Big('132789069442123') as u<Token<BigSource>>,
  },
  {
    symbol: 'bATOM',
    name: 'Bonded ATOM',
    icon: 'https://files.pstake.finance/logos/bAssets/bATOM.svg',
    votes: Big('211789069442123') as u<Token<BigSource>>,
  },
  {
    symbol: 'wasAVAX',
    name: 'BENQI Staked AVAX (Portal)',
    icon: 'https://benqi.fi/images/assets/savax.svg',
    votes: Big('111189069442123') as u<Token<BigSource>>,
  },
];

export interface GaugeCollateral {
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
