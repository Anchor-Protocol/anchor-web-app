import {
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { EvmSdk } from '@anchor-protocol/crossanchor-sdk';
import { useEvmSdk } from 'crossanchor';
import { useQuery, UseQueryResult } from 'react-query';

const evmTerraAddressQuery = async (
  sdk: EvmSdk,
  evmAddr: string | undefined,
): Promise<string | undefined> => {
  if (evmAddr === undefined) {
    return undefined;
  }
  try {
    return await sdk.terraAddress(evmAddr);
  } catch (error) {
    return undefined;
  }
};

export function useEvmTerraAddressQuery(
  evmAddr: string | undefined,
): UseQueryResult<string | undefined> {
  const xAnchor = useEvmSdk();

  const { queryErrorReporter } = useAnchorWebapp();

  const terraAddress = useQuery(
    [ANCHOR_QUERY_KEY.EVM_TERRA_ADDRESS, evmAddr],
    () => evmTerraAddressQuery(xAnchor, evmAddr),
    {
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return terraAddress;
}
