import { Num, Ratio, uaUST, uUST } from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { gql, QueryResult, useQuery } from '@apollo/client';
import big from 'big.js';
import { useAddressProvider } from 'contexts/contract';
import { useLastSyncedHeight } from 'pages/earn/queries/lastSyncedHeight';
import { useMemo } from 'react';

export interface StringifiedData {
  aUSTBalance: {
    Result: string;
  };
  exchangeRate: {
    Result: string;
  };
}

export interface Data {
  aUSTBalance: {
    balance: uaUST<string>;
  };
  exchangeRate: {
    a_token_supply: Num<string>;
    exchange_rate: Ratio<string>;
  };
  totalDeposit: uUST<string>;
}

export function parseData({
  aUSTBalance,
  exchangeRate,
}: StringifiedData): Data {
  const parsedAUSTBalance: Data['aUSTBalance'] = JSON.parse(aUSTBalance.Result);
  const parsedExchangeRate: Data['exchangeRate'] = JSON.parse(
    exchangeRate.Result,
  );
  return {
    aUSTBalance: parsedAUSTBalance,
    exchangeRate: parsedExchangeRate,
    totalDeposit: big(parsedAUSTBalance.balance)
      .mul(parsedExchangeRate.exchange_rate)
      .toString() as uUST,
  };
}

export interface StringifiedVariables {
  anchorTokenContract: string;
  anchorTokenBalanceQuery: string;
  moneyMarketContract: string;
  moneyMarketEpochQuery: string;
}

export interface Variables {
  anchorTokenContract: string;
  anchorTokenBalanceQuery: {
    balance: {
      address: string;
    };
  };
  moneyMarketContract: string;
  moneyMarketEpochQuery: {
    epoch_state: {
      lastSyncedHeight: number;
    };
  };
}

export function stringifyVariables({
  anchorTokenContract,
  anchorTokenBalanceQuery,
  moneyMarketContract,
  moneyMarketEpochQuery,
}: Variables): StringifiedVariables {
  return {
    anchorTokenContract,
    anchorTokenBalanceQuery: JSON.stringify(anchorTokenBalanceQuery),
    moneyMarketContract,
    moneyMarketEpochQuery: JSON.stringify(moneyMarketEpochQuery),
  };
}

export const query = gql`
  query earnTotalDeposit(
    $anchorTokenContract: String!
    $anchorTokenBalanceQuery: String!
    $moneyMarketContract: String!
    $moneyMarketEpochQuery: String!
  ) {
    aUSTBalance: WasmContractsContractAddressStore(
      ContractAddress: $anchorTokenContract
      QueryMsg: $anchorTokenBalanceQuery
    ) {
      Result
    }

    exchangeRate: WasmContractsContractAddressStore(
      ContractAddress: $moneyMarketContract
      QueryMsg: $moneyMarketEpochQuery
    ) {
      Result
    }
  }
`;

export function useTotalDeposit(): QueryResult<
  StringifiedData,
  StringifiedVariables
> & { parsedData: Data | undefined } {
  const addressProvider = useAddressProvider();
  const { status } = useWallet();

  const { parsedData: lastSyncedHeight } = useLastSyncedHeight();

  const variables = useMemo(() => {
    return stringifyVariables({
      anchorTokenContract: addressProvider.aToken(''),
      anchorTokenBalanceQuery: {
        balance: {
          address: status.status === 'ready' ? status.walletAddress : '',
        },
      },
      moneyMarketContract: addressProvider.market(''),
      moneyMarketEpochQuery: {
        epoch_state: {
          lastSyncedHeight:
            typeof lastSyncedHeight === 'number' ? lastSyncedHeight : 0,
        },
      },
    });
  }, [addressProvider, lastSyncedHeight, status]);

  const result = useQuery<StringifiedData, StringifiedVariables>(query, {
    skip: status.status !== 'ready' || typeof lastSyncedHeight !== 'number',
    variables,
  });

  const parsedData = useMemo(
    () => (result.data ? parseData(result.data) : undefined),
    [result.data],
  );

  return {
    ...result,
    parsedData,
  };
}
