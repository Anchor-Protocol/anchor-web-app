import { DateTime, Rate } from '@anchor-protocol/types';

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

  lpRewards: Array<{
    APY: Rate;
    Height: number;
    Timestamp: DateTime;
  }>;
}

export async function borrowAPYQuery(endpoint: string): Promise<BorrowAPYData> {
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

  const lpRewards = await fetch(`${endpoint}/v2/ust-lp-reward`)
    .then((res) => res.json())
    .then(
      ({
        height,
        timestamp,
        apy,
      }: {
        height: number;
        timestamp: DateTime;
        apy: Rate;
      }) => {
        return {
          APY: apy,
          Height: height,
          Timestamp: timestamp,
        };
      },
    );

  return {
    borrowerDistributionAPYs: [borrowerDistributionAPYs],
    govRewards: [govRewards],
    lpRewards: [lpRewards],
  };

  //return await mantleFetch<{}, BorrowAPYData>(
  //  BORROW_APY_QUERY,
  //  {},
  //  `${mantleEndpoint}?borrow--apy`,
  //);
}
