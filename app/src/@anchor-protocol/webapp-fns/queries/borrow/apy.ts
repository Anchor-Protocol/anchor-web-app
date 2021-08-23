import { DateTime, Rate } from '@anchor-protocol/types';
import { MantleFetch } from '@libs/webapp-fns';

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

// language=graphql
export const BORROW_APY_QUERY = `
  query {
    borrowerDistributionAPYs: AnchorBorrowerDistributionAPYs(
      Order: DESC
      Limit: 1
    ) {
      Height
      Timestamp
      DistributionAPY
    }
    govRewards: AnchorGovRewardRecords(Order: DESC, Limit: 1) {
      CurrentAPY
      Timestamp
      Height
    }
    lpRewards: AnchorLPRewards(Order: DESC, Limit: 1) {
      Height
      Timestamp
      APY
    }
  }
`;

export interface BorrowAPYQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
}

export async function borrowAPYQuery({
  mantleEndpoint,
  mantleFetch,
}: BorrowAPYQueryParams) {
  return await mantleFetch<{}, BorrowAPYData>(
    BORROW_APY_QUERY,
    {},
    `${mantleEndpoint}?borrow--apy`,
  );
}
