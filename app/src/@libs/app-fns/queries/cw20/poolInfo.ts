import { QueryClient } from '@libs/query-client';
import { cw20, CW20Addr, HumanAddr, terraswap, Token, UST } from '@libs/types';
import { cw20TokenInfoQuery } from '../cw20/tokenInfo';
import { terraswapPairQuery } from '../terraswap/pair';
import { TerraswapPoolInfo, terraswapPoolQuery } from '../terraswap/pool';

export type CW20PoolInfo<T extends Token> = {
  tokenAddr: CW20Addr;
  terraswapPair: terraswap.factory.PairResponse;
  terraswapPool: terraswap.pair.PoolResponse<T, UST>;
  terraswapPoolInfo: TerraswapPoolInfo<T>;
  tokenInfo: cw20.TokenInfoResponse<T>;
};

export async function cw20PoolInfoQuery<T extends Token>(
  tokenAddr: CW20Addr,
  terraswapFactoryAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<CW20PoolInfo<T>> {
  const { terraswapPair } = await terraswapPairQuery(
    terraswapFactoryAddr,
    [
      {
        token: {
          contract_addr: tokenAddr,
        },
      },
      {
        native_token: {
          denom: 'uusd',
        },
      },
    ],
    queryClient,
  );

  const { tokenInfo } = await cw20TokenInfoQuery<T>(tokenAddr, queryClient);

  const { terraswapPool, terraswapPoolInfo } = await terraswapPoolQuery<T>(
    terraswapPair.contract_addr,
    queryClient,
  );

  return {
    tokenAddr,
    terraswapPair,
    terraswapPool,
    terraswapPoolInfo,
    tokenInfo,
  };
}
