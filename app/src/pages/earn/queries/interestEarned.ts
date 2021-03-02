import { floor } from '@anchor-protocol/big-math';
import { useEventBus } from '@anchor-protocol/event-bus';
import type { DateTime, JSDateTime, Rate, uUST } from '@anchor-protocol/types';
import { createMap, Mapped, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import big from 'big.js';
import { useService } from 'contexts/service';
import { sub } from 'date-fns';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useEffect, useMemo } from 'react';

type Earned = {
  Address: string;
  CurrentDeposit: uUST<string>;
  Height: number;
  StableDenom: string; // uusd
  Timestamp: DateTime;
  TotalDeposit: uUST<string>;
  TotalWithdraw: uUST<string>;
  CurrentAnchorBalance: uUST<string>;
};

export interface RawData {
  latestExchangeRate: {
    StableDenom: string;
    ExchangeRate: Rate<string>;
  }[];
  thenExchangeRate: {
    StableDenom: string;
    ExchangeRate: Rate<string>;
  }[];
  fallback: Earned[];
  now?: Earned[];
  then?: Earned[];
}

export interface Data {
  interestEarned: uUST<string>;
}

export const dataMap = createMap<RawData, Data>({
  interestEarned: (
    _,
    { now, then, fallback, latestExchangeRate, thenExchangeRate },
  ) => {
    if (!now || now.length === 0) {
      return '0' as uUST;
    }

    const referenceNow = now[0];
    const referenceThen = then && then.length >= 1 ? then[0] : fallback[0];

    const currentTokenValue = big(
      referenceNow.CurrentAnchorBalance.length > 0
        ? referenceNow.CurrentAnchorBalance
        : '0',
    ).mul(latestExchangeRate[0].ExchangeRate);

    const thenTokenValue = big(
      referenceThen.CurrentAnchorBalance.length > 0
        ? referenceThen.CurrentAnchorBalance
        : '0',
    ).mul(thenExchangeRate[0].ExchangeRate);

    try {
      return floor(
        currentTokenValue
          .minus(thenTokenValue)
          .plus(
            big(referenceNow.TotalWithdraw).minus(referenceThen.TotalWithdraw),
          )
          .minus(
            big(referenceNow.TotalDeposit).minus(referenceThen.TotalDeposit),
          ),
      ).toFixed() as uUST;
    } catch {
      return '0' as uUST;
    }
  },
});

export const mockupData: Mapped<RawData, Data> = {
  __data: {
    latestExchangeRate: [],
    thenExchangeRate: [],
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
    latestExchangeRate: AnchorExchangeRates(
      Order: DESC
      Limit: 1
      StableDenom: $stable_denom
    ) {
      StableDenom
      ExchangeRate
    }

    thenExchangeRate: AnchorExchangeRates(
      Order: ASC
      Limit: 1
      StableDenom: $stable_denom
      Timestamp_range: [$then, $now]
    ) {
      StableDenom
      ExchangeRate
    }

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
      CurrentAnchorBalance
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
      CurrentAnchorBalance
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
      CurrentAnchorBalance
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
  const { dispatch } = useEventBus();

  const { serviceAvailable, walletReady } = useService();

  const variables = useMemo(() => {
    if (!walletReady) return undefined;

    const { now, then } = getDates(period);

    return mapVariables({
      walletAddress: walletReady.walletAddress,
      now,
      then,
    });
  }, [period, walletReady]);

  const onError = useQueryErrorHandler();

  const {
    previousData,
    data: _data = previousData,
    refetch: _refetch,
    error,
    ...result
  } = useQuery<RawData, RawVariables>(query, {
    skip: !variables || !serviceAvailable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables,
    onError,
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  useEffect(() => {
    dispatch('interest-earned-updated');
  }, [variables, dispatch]);

  return {
    ...result,
    data: serviceAvailable ? data : mockupData,
    refetch,
  };
}
