import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import { uaUST, ubLuna, uLuna, uUST } from '@anchor-protocol/notation';
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
  uUSD: uUST<string>;

  uLuna: uLuna<string>;

  ubLuna: ubLuna<string>;

  uaUST: uaUST<string>;
}

export function parseData({
  bankBalances,
  uaUSTBalance,
  ubLunaBalance,
}: StringifiedData): Data {
  const bank = bankBalances.Result;

  const bluna: { balance: string } = JSON.parse(ubLunaBalance.Result);
  const aust: { balance: string } = JSON.parse(uaUSTBalance.Result);
  const usd: string | undefined = bank.find(({ Denom }) => Denom === 'uusd')
    ?.Amount;
  const luna: string | undefined = bank.find(({ Denom }) => Denom === 'uluna')
    ?.Amount;

  return {
    uUSD: (usd ?? '0') as uUST,
    uLuna: (luna ?? '0') as uLuna,
    ubLuna: bluna.balance as ubLuna,
    uaUST: aust.balance as uaUST,
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

  useSubscription((id, event) => {
    if (event === 'done') {
      result.refetch();
    }
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
