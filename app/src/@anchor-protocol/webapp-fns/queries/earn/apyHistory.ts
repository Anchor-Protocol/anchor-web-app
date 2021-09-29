import { DateTime, JSDateTime, Rate } from '@anchor-protocol/types';
import { MantleFetch } from '@libs/mantle';

export interface EarnAPYHistoryData {
  apyHistory: {
    Timestamp: DateTime;
    Height: number;
    DepositRate: Rate;
  }[];
}

export interface EarnAPYHistoryRawVariables {
  timestampMax: DateTime;
}

export interface EarnAPYHistoryVariables {
  timestampMax: JSDateTime;
}

// TODO (API) ?
// language=graphql
export const EARN_APY_HISTORY_QUERY = `
  query ($timestampMax: Int!) {
    apyHistory: AnchorDepositRateHistory(
      Order: DESC
      Limit: 9
      Timestamp_range: [0, $timestampMax]
    ) {
      Timestamp
      Height
      DepositRate
    }
  }
`;

export interface EarnAPYHistoryQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: EarnAPYHistoryVariables;
}

export async function earnAPYHistoryQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: EarnAPYHistoryQueryParams): Promise<EarnAPYHistoryData> {
  return await mantleFetch<EarnAPYHistoryRawVariables, EarnAPYHistoryData>(
    EARN_APY_HISTORY_QUERY,
    {
      timestampMax: Math.floor(variables.timestampMax / 1000) as DateTime,
    } as EarnAPYHistoryRawVariables,
    `${mantleEndpoint}?earn--apy-history`,
  );
}
