import { useQuerySubscription } from '@anchor-protocol/use-broadcastable-query';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { gql, QueryResult, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useMemo } from 'react';

export interface StringifiedData {
  bankBalances: {
    Result: { Denom: string; Amount: string }[];
  };

  ubLunaBalance: {
    Result: string;
  };

  uaUSTBalance: {
    Result: string;
  };
}

export interface Data {
  uUSD: string;

  uLuna: string;

  ubLuna: string;

  uaUST: string;
}

export function parseData({
  bankBalances,
  uaUSTBalance,
  ubLunaBalance,
}: StringifiedData): Data {
  const bank = bankBalances.Result;
  const ubLuna: { balance: string } = JSON.parse(ubLunaBalance.Result);
  const uaUST: { balance: string } = JSON.parse(uaUSTBalance.Result);

  const uUSD: string | undefined = bank.find(({ Denom }) => Denom === 'uusd')
    ?.Amount;
  const uLuna: string | undefined = bank.find(({ Denom }) => Denom === 'uluna')
    ?.Amount;

  return {
    uUSD: uUSD ?? '0',
    uLuna: uLuna ?? '0',
    ubLuna: ubLuna.balance,
    uaUST: uaUST.balance,
  };
}

export interface StringifiedVariables {
  walletAddress: string;
  bAssetTokenAddress: string;
  bAssetTokenBalanceQuery: string;
  aTokenAddress: string;
  aTokenBalanceQuery: string;
}

export interface Variables {
  walletAddress: string;
  bAssetTokenAddress: string;
  aTokenAddress: string;
}

export function stringifyVariables({
  walletAddress,
  bAssetTokenAddress,
  aTokenAddress,
}: Variables): StringifiedVariables {
  return {
    walletAddress,
    bAssetTokenAddress,
    bAssetTokenBalanceQuery: JSON.stringify({
      balance: {
        address: walletAddress,
      },
    }),
    aTokenAddress,
    aTokenBalanceQuery: JSON.stringify({
      balance: {
        address: walletAddress,
      },
    }),
  };
}

export const query = gql`
  query(
    $walletAddress: String!
    $bAssetTokenAddress: String!
    $bAssetTokenBalanceQuery: String!
    $aTokenAddress: String!
    $aTokenBalanceQuery: String!
  ) {
    # uluna, ukrt, uust...
    bankBalances: BankBalancesAddress(Address: $walletAddress) {
      Result {
        Denom
        Amount
      }
    }

    # ubluna
    ubLunaBalance: WasmContractsContractAddressStore(
      ContractAddress: $bAssetTokenAddress
      QueryMsg: $bAssetTokenBalanceQuery
    ) {
      Result
    }

    # uaust
    uaUSTBalance: WasmContractsContractAddressStore(
      ContractAddress: $aTokenAddress
      QueryMsg: $aTokenBalanceQuery
    ) {
      Result
    }
  }
`;

export function useUserBalances(): QueryResult<
  StringifiedData,
  StringifiedVariables
> & {
  parsedData: Data | undefined;
} {
  const addressProvider = useAddressProvider();
  const { status } = useWallet();

  const result = useQuery<StringifiedData, StringifiedVariables>(query, {
    skip: status.status !== 'ready',
    fetchPolicy: 'cache-and-network',
    variables: stringifyVariables({
      walletAddress: status.status === 'ready' ? status.walletAddress : '',
      bAssetTokenAddress: addressProvider.bAssetToken('bluna'),
      aTokenAddress: addressProvider.aToken('usd'),
    }),
  });

  useQuerySubscription(
    (id, event) => {
      if (event === 'done') {
        result.refetch();
      }
    },
    [result.refetch],
  );

  const parsedData = useMemo(
    () => (result.data ? parseData(result.data) : undefined),
    [result.data],
  );

  return {
    ...result,
    parsedData,
  };
}
