import { EVM_QUERY_KEY } from '@libs/app-provider';
import { ERC20Addr } from '@libs/types';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useAnchorQuery, WhitelistCollateral } from 'queries';
import { UseQueryResult } from 'react-query';
import '@extensions/xanchor';
import { ERC20Token } from '@extensions/xanchor';

export const useERC20TokenQuery = (
  addressOrCollateral: WhitelistCollateral | ERC20Addr | undefined,
): UseQueryResult<ERC20Token | undefined> => {
  const sdk = useEvmCrossAnchorSdk();

  return useAnchorQuery(
    [EVM_QUERY_KEY.ERC20_TOKEN, addressOrCollateral],
    async () => {
      if (addressOrCollateral) {
        return await sdk.fetchERC20Token(addressOrCollateral);
      }
      return undefined;
    },
    {
      refetchOnMount: false,
      keepPreviousData: true,
    },
  );
};
