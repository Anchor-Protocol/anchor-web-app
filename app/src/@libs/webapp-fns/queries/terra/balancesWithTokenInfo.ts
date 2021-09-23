import { defaultMantleFetch, MantleFetch } from '@libs/mantle';
import { cw20, HumanAddr, terraswap, Token, u } from '@libs/types';
import { nativeTokenInfoQuery } from '../cw20/nativeTokenInfo';
import { cw20TokenInfoQuery } from '../cw20/tokenInfo';
import { terraBalancesQuery } from './balances';

export type TerraBalancesWithTokenInfo = {
  tokens: Array<{
    asset: terraswap.AssetInfo;
    balance: u<Token>;
    info: cw20.TokenInfoResponse<Token> | undefined;
  }>;
};

export async function terraBalancesWithTokenInfoQuery(
  walletAddr: HumanAddr | undefined,
  assets: terraswap.AssetInfo[],
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<TerraBalancesWithTokenInfo> {
  const { balances } = await terraBalancesQuery(
    walletAddr,
    assets,
    mantleEndpoint,
    mantleFetch,
    requestInit,
  );

  const tokenInfos = await Promise.all(
    assets.map((asset) => {
      if ('native_token' in asset) {
        return Promise.resolve(nativeTokenInfoQuery(asset.native_token.denom));
      } else {
        return cw20TokenInfoQuery(
          asset.token.contract_addr,
          mantleEndpoint,
          mantleFetch,
          requestInit,
        ).then(({ tokenInfo }) => tokenInfo);
      }
    }),
  );

  return {
    tokens: balances.map(({ balance, asset }, i) => {
      return {
        balance,
        asset,
        info: tokenInfos[i],
      };
    }),
  };
}
