import { QueryClient } from '@libs/query-client';
import { cw20, CW20Addr, NativeDenom, terraswap, Token } from '@libs/types';
import { FormReturn } from '@libs/use-form';
import { nativeTokenInfoQuery } from '../../queries/cw20/nativeTokenInfo';
import { cw20TokenInfoQuery } from '../../queries/cw20/tokenInfo';

export type SendTokenInfo = {
  assetInfo: terraswap.AssetInfo;
  tokenInfo: cw20.TokenInfoResponse<Token>;
};

export interface SendTokensFormInput {
  nativeDenoms: NativeDenom[];
  cw20Addrs: CW20Addr[];

  selectedTokenInfo: SendTokenInfo | undefined;

  selectToken?:
    | ((tokenInfo: SendTokenInfo[]) => SendTokenInfo | undefined)
    | null;
}

export interface SendTokensFormDependency {
  //
  queryClient: QueryClient;

  fallbackTokenInfo: SendTokenInfo;
}

export interface SendTokensFormStates
  extends Omit<SendTokensFormInput, 'selectedTokenInfo'> {
  tokenInfos: SendTokenInfo[];
  selectedTokenInfo: SendTokenInfo;
}

export type SendTokensFormAsyncStates = {
  nativeTokenInfos: SendTokenInfo[];
  cw20TokenInfos: SendTokenInfo[];
};

export const sendTokensForm = (
  dependency: SendTokensFormDependency,
  prevDependency: SendTokensFormDependency | undefined,
) => {
  let tokenInfoAsyncStates: Promise<SendTokensFormAsyncStates>;

  return (
    input: SendTokensFormInput,
    prevInput: SendTokensFormInput | undefined,
  ): FormReturn<SendTokensFormStates, SendTokensFormAsyncStates> => {
    if (
      !tokenInfoAsyncStates ||
      dependency.queryClient !== prevDependency?.queryClient ||
      input.nativeDenoms !== prevInput?.nativeDenoms ||
      input.cw20Addrs !== prevInput?.cw20Addrs
    ) {
      tokenInfoAsyncStates = Promise.all([
        Promise.all(
          input.nativeDenoms.map((denom) =>
            Promise.resolve(nativeTokenInfoQuery(denom)).then(
              (tokenInfo) =>
                tokenInfo && {
                  assetInfo: {
                    native_token: {
                      denom,
                    },
                  } as terraswap.AssetInfo,
                  tokenInfo,
                },
            ),
          ),
        ),
        Promise.all(
          input.cw20Addrs.map((tokenAddr) =>
            cw20TokenInfoQuery(
              tokenAddr,
              dependency.queryClient,
              //dependency.mantleEndpoint,
              //dependency.mantleFetch,
              //dependency.requestInit,
            ).then(({ tokenInfo }) => ({
              assetInfo: {
                token: {
                  contract_addr: tokenAddr,
                },
              },
              tokenInfo,
            })),
          ),
        ),
      ]).then(([_nativeTokenInfos, cw20TokenInfos]) => {
        const nativeTokenInfos = _nativeTokenInfos.filter(
          (item): item is SendTokenInfo => !!item,
        );
        const tokenInfos = [...nativeTokenInfos, ...cw20TokenInfos];

        const asyncStates: SendTokensFormAsyncStates &
          Partial<SendTokensFormStates> = {
          nativeTokenInfos,
          cw20TokenInfos,
          tokenInfos,
        };

        if (!!input.selectToken) {
          const selectedTokenInfo = input.selectToken(tokenInfos);
          if (selectedTokenInfo) {
            asyncStates.selectedTokenInfo = selectedTokenInfo;
          }
        }

        return asyncStates;
      });
    }

    return [
      {
        ...input,
        tokenInfos: [],
        selectedTokenInfo:
          input.selectedTokenInfo ?? dependency.fallbackTokenInfo,
      },
      tokenInfoAsyncStates,
    ];
  };
};
