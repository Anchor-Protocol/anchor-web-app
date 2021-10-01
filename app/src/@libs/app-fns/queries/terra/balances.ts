import { hiveFetch, lcdFetch, QueryClient } from '@libs/query-client';
import {
  cw20,
  HumanAddr,
  NativeDenom,
  Num,
  terraswap,
  Token,
  u,
} from '@libs/types';

// language=graphql
const NATIVE_BALANCES_QUERY = `
  query ($walletAddress: String!) {
    nativeTokenBalances: BankBalancesAddress(Address: $walletAddress) {
      Result {
        Denom
        Amount
      }
    }
  }
`;

interface NativeBalancesQueryVariables {
  walletAddress: HumanAddr;
}

interface NativeBalancesQueryResult {
  nativeTokenBalances: {
    Result: Array<{ Denom: NativeDenom; Amount: u<Token> }>;
  };
}

interface LcdBankBalances {
  height: Num;
  result: Array<{ denom: NativeDenom; amount: u<Token> }>;
}

export type TerraBalances = {
  balances: Array<{ asset: terraswap.AssetInfo; balance: u<Token> }>;
  balancesIndex: Map<terraswap.AssetInfo, u<Token>>;
};

export async function terraBalancesQuery(
  walletAddr: HumanAddr | undefined,
  assets: terraswap.AssetInfo[],
  queryClient: QueryClient,
): Promise<TerraBalances> {
  type CW20Query = Record<
    string,
    { contractAddress: string; query: cw20.Balance }
  >;

  if (!walletAddr) {
    const balances = assets.map((asset) => ({
      asset,
      balance: '0' as u<Token>,
    }));

    const balancesIndex = new Map<terraswap.AssetInfo, u<Token>>();

    for (const { asset, balance } of balances) {
      balancesIndex.set(asset, balance);
    }

    return Promise.resolve({ balances, balancesIndex });
  }

  const wasmQuery: CW20Query = assets.reduce((wq, asset, i) => {
    if ('token' in asset) {
      wq['asset' + i] = {
        contractAddress: asset.token.contract_addr,
        query: {
          balance: {
            address: walletAddr,
          },
        },
      };
    }
    return wq;
  }, {} as CW20Query);

  const balancesPromise: Promise<TerraBalances['balances']> =
    'lcdEndpoint' in queryClient
      ? Promise.all([
          queryClient.lcdFetcher<LcdBankBalances>(
            `${queryClient.lcdEndpoint}/bank/balances/${walletAddr}`,
            queryClient.requestInit,
          ),
          lcdFetch<any>({
            ...queryClient,
            id: `terra-balances=${walletAddr}`,
            wasmQuery,
          }),
        ]).then(([nativeTokenBalances, cw20TokenBalances]) => {
          return assets.map((asset, i) => {
            if ('token' in asset) {
              const cw20Balance: cw20.BalanceResponse<Token> =
                cw20TokenBalances['asset' + i] as any;
              return { asset, balance: cw20Balance.balance };
            }

            const nativeAsset = nativeTokenBalances.result.find(
              ({ denom }) => asset.native_token.denom === denom,
            );

            return { asset, balance: nativeAsset?.amount ?? ('0' as u<Token>) };
          });
        })
      : hiveFetch<any, NativeBalancesQueryVariables, NativeBalancesQueryResult>(
          {
            ...queryClient,
            id: `terra-balances=${walletAddr}`,
            variables: {
              walletAddress: walletAddr,
            },
            wasmQuery,
            query: NATIVE_BALANCES_QUERY,
          },
        ).then((result) => {
          return assets.map((asset, i) => {
            if ('token' in asset) {
              const cw20Balance: cw20.BalanceResponse<Token> = result[
                'asset' + i
              ] as any;
              return { asset, balance: cw20Balance.balance };
            }

            const nativeAsset = result.nativeTokenBalances.Result.find(
              ({ Denom }) => asset.native_token.denom === Denom,
            );

            return { asset, balance: nativeAsset?.Amount ?? ('0' as u<Token>) };
          });
        });

  const balances = await balancesPromise;

  const balancesIndex = new Map<terraswap.AssetInfo, u<Token>>();

  for (const { asset, balance } of balances) {
    balancesIndex.set(asset, balance);
  }

  return { balances, balancesIndex };
}
