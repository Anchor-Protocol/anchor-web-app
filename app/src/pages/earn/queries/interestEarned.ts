import { DateTime, JSDateTime, uUST } from '@anchor-protocol/notation';
import { createMap, Mapped, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import big from 'big.js';
import { useService } from 'contexts/service';
import { sub } from 'date-fns';
import { MappedQueryResult } from 'queries/types';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

type Earned = {
  Address: string;
  CurrentDeposit: uUST<string>;
  Height: number;
  StableDenom: string; // uusd
  Timestamp: DateTime;
  TotalDeposit: uUST<string>;
  TotalWithdraw: uUST<string>;
};

export interface RawData {
  fallback: Earned[];
  now?: Earned[];
  then?: Earned[];
}

export interface Data {
  interestEarned: uUST<string>;
}

export const dataMap = createMap<RawData, Data>({
  interestEarned: (_, { now, then, fallback }) => {
    if (!now || now.length === 0) {
      return '0' as uUST;
    }

    const referenceNow = now[0];
    const referenceThen = then && then.length >= 1 ? then[0] : fallback[0];

    try {
      return big(referenceNow.CurrentDeposit)
        .minus(referenceThen.CurrentDeposit)
        .plus(referenceNow.TotalDeposit)
        .minus(referenceThen.TotalWithdraw)
        .toFixed() as uUST;
    } catch {
      return '0' as uUST;
    }
  },
});

export const mockupData: Mapped<RawData, Data> = {
  __data: {
    fallback: [],
    now: [],
    then: [],
  },
  interestEarned: '0' as uUST,
};

export interface RawVariables {
  walletAddress: string;
  now: DateTime;
  then: DateTime;
  stable_denom: string;
}

export interface Variables {
  walletAddress: string;
  now: JSDateTime;
  then: JSDateTime;
}

export function mapVariables({
  walletAddress,
  now,
  then,
}: Variables): RawVariables {
  return {
    walletAddress,
    now: Math.floor(now / 1000) as DateTime,
    then: Math.floor(then / 1000) as DateTime,
    stable_denom: 'uusd',
  };
}

export const query = gql`
  query __interestEarned(
    $walletAddress: String!
    $now: Int!
    $then: Int!
    $stable_denom: String!
  ) {
    now: InterestEarnedUserRecords(
      Order: DESC
      Limit: 1
      Address: $walletAddress
      StableDenom: $stable_denom
    ) {
      Address
      StableDenom
      Height
      Timestamp
      TotalDeposit
      TotalWithdraw
      CurrentDeposit
    }

    then: InterestEarnedUserRecords(
      Order: DESC
      Limit: 1
      Address: $walletAddress
      Timestamp_range: [0, $then]
      StableDenom: $stable_denom
    ) {
      Address
      StableDenom
      Height
      Timestamp
      TotalDeposit
      TotalWithdraw
      CurrentDeposit
    }

    fallback: InterestEarnedUserRecords(
      Order: ASC
      Limit: 1
      Address: $walletAddress
      Timestamp_range: [$then, $now]
      StableDenom: $stable_denom
    ) {
      Address
      StableDenom
      Height
      Timestamp
      TotalDeposit
      TotalWithdraw
      CurrentDeposit
    }
  }
`;

export const totalQuery = gql`
  query __interestEarnedTotal(
    $walletAddress: String!
    $now: Int!
    $stable_denom: String!
  ) {
    now: InterestEarnedUserRecords(
      Order: DESC
      Limit: 1
      Address: $walletAddress
      StableDenom: $stable_denom
    ) {
      Address
      StableDenom
      Height
      Timestamp
      TotalDeposit
      TotalWithdraw
      CurrentDeposit
    }

    then: InterestEarnedUserRecords(
      Order: ASC
      Limit: 1
      Address: $walletAddress
      Timestamp_range: [0, $now]
      StableDenom: $stable_denom
    ) {
      Address
      StableDenom
      Height
      Timestamp
      TotalDeposit
      TotalWithdraw
      CurrentDeposit
    }

    fallback: InterestEarnedUserRecords(
      Order: ASC
      Limit: 1
      Address: $walletAddress
      Timestamp_range: [0, $now]
      StableDenom: $stable_denom
    ) {
      Address
      StableDenom
      Height
      Timestamp
      TotalDeposit
      TotalWithdraw
      CurrentDeposit
    }
  }
`;

function getDates(
  period: 'total' | 'year' | 'month' | 'week' | 'day',
): { now: JSDateTime; then: JSDateTime } {
  const now = Date.now() as JSDateTime;

  return {
    now,
    then:
      period === 'total'
        ? (0 as JSDateTime)
        : period === 'year'
        ? (sub(now, { years: 1 }).getTime() as JSDateTime)
        : period === 'month'
        ? (sub(now, { months: 1 }).getTime() as JSDateTime)
        : period === 'week'
        ? (sub(now, { weeks: 1 }).getTime() as JSDateTime)
        : (sub(now, { days: 1 }).getTime() as JSDateTime),
  };
}

export type Period = 'total' | 'year' | 'month' | 'week' | 'day';

export function useInterestEarned(
  period: Period,
): MappedQueryResult<RawVariables, RawData, Data> {
  const { serviceAvailable, walletReady } = useService();

  const variables = useMemo(() => {
    const { now, then } = getDates(period);

    return mapVariables({
      walletAddress: walletReady?.walletAddress ?? '',
      now,
      then,
    });
  }, [period, walletReady?.walletAddress]);

  const { data: _data, refetch: _refetch, ...result } = useQuery<
    RawData,
    RawVariables
  >(period === 'total' ? totalQuery : query, {
    skip: !serviceAvailable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables,
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data: serviceAvailable ? data : mockupData,
    refetch,
  };
}
