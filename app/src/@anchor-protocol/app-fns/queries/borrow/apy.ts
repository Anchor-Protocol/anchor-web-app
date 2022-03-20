import { DateTime, Rate } from '@anchor-protocol/types';
import { hiveFetch } from '@libs/query-client';

export interface BorrowAPYData {
  borrowerDistributionAPYs: Array<{
    DistributionAPY: Rate;
    Height: number;
    Timestamp: DateTime;
  }>;

  govRewards: Array<{
    CurrentAPY: Rate;
    Timestamp: DateTime;
    Height: number;
  }>;

  lpRewards: Array<LPReward>;
}

type LPReward = {
  apr: Rate<number>;
  apy: Rate<number>;
};

type LpRewardsQueryResult = {
  pool: {
    total_rewards: {
      apr: number;
      apy: number;
    };
  };
};

// language=graphql
const LP_REWARDS_QUERY = `
  query LpRewardsQuery($address: String!) {
    pool(address: $address) {
      total_rewards {
        apr
        apy
      }
    }
  }
`;

export async function borrowAPYQuery(
  endpoint: string,
  ancUstPair: string,
): Promise<BorrowAPYData> {
  const borrowerDistributionAPYs = await fetch(
    `${endpoint}/v2/distribution-apy`,
  )
    .then((res) => res.json())
    .then(
      ({
        height,
        timestamp,
        distribution_apy,
      }: {
        height: number;
        timestamp: DateTime;
        distribution_apy: Rate;
      }) => {
        return {
          DistributionAPY: distribution_apy,
          Height: height,
          Timestamp: timestamp,
        };
      },
    );

  const govRewards = await fetch(`${endpoint}/v2/gov-reward`)
    .then((res) => res.json())
    .then(
      ({
        height,
        timestamp,
        current_apy,
      }: {
        height: number;
        timestamp: DateTime;
        current_apy: Rate;
      }) => {
        return {
          CurrentAPY: current_apy,
          Timestamp: timestamp,
          Height: height,
        };
      },
    );

  const ancAstroLPRewards = await hiveFetch<any, {}, LpRewardsQueryResult>({
    hiveEndpoint: 'https://api.astroport.fi/graphql',
    variables: {
      address: ancUstPair,
    },
    wasmQuery: {},
    query: LP_REWARDS_QUERY,
  }).then((res) => {
    if (!res.pool) {
      return { apr: 0, apy: 0 };
    }
    return res.pool.total_rewards;
  });

  return {
    borrowerDistributionAPYs: [borrowerDistributionAPYs],
    govRewards: [govRewards],
    lpRewards: [ancAstroLPRewards as LPReward],
  };
}
