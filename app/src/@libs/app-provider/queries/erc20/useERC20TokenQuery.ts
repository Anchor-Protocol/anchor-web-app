import { EVM_QUERY_KEY } from '@libs/app-provider';
import { ERC20Addr } from '@libs/types';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useAnchorQuery } from 'queries';
import { UseQueryResult } from 'react-query';
import '@extensions/crossanchor';
import { ERC20Token } from '@extensions/crossanchor';

export const useERC20TokenQuery = (
  address: ERC20Addr | undefined,
): UseQueryResult<ERC20Token | undefined> => {
  const sdk = useEvmCrossAnchorSdk();

  return useAnchorQuery(
    [EVM_QUERY_KEY.ERC20_TOKEN, address],
    async () => {
      if (address) {
        return await sdk.fetchERC20Token(address);
      }
      return undefined;
    },
    {
      refetchOnMount: false,
      keepPreviousData: true,
    },
  );
};
