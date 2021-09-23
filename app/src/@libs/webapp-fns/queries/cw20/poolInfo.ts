import { defaultMantleFetch, MantleFetch } from '@libs/mantle';
import {
  cw20,
  CW20Addr,
  HumanAddr,
  NativeDenom,
  terraswap,
  Token,
  UST,
} from '@libs/types';
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
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
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
          denom: 'uusd' as NativeDenom,
        },
      },
    ],
    mantleEndpoint,
    mantleFetch,
    requestInit,
  );

  const { tokenInfo } = await cw20TokenInfoQuery<T>(
    tokenAddr,
    mantleEndpoint,
    mantleFetch,
    requestInit,
  );

  const { terraswapPool, terraswapPoolInfo } = await terraswapPoolQuery<T>(
    terraswapPair.contract_addr,
    mantleEndpoint,
    mantleFetch,
    requestInit,
  );

  return {
    tokenAddr,
    terraswapPair,
    terraswapPool,
    terraswapPoolInfo,
    tokenInfo,
  };
}
