import { CW20Addr, HumanAddr } from '@anchor-protocol/types';
import { AncBalance, ancBalanceQuery } from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@packages/react-query-utils';
import {
  EMPTY_QUERY_RESULT,
  MantleFetch,
  useTerraWebapp,
} from '@packages/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    ancContract: CW20Addr,
    walletAddress: HumanAddr,
  ) => {
    return ancBalanceQuery({
      mantleEndpoint,
      mantleFetch,
      wasmQuery: {
        ancBalance: {
          contractAddress: ancContract,
          query: {
            balance: {
              address: walletAddress,
            },
          },
        },
      },
    });
  },
);

export function useAncBalanceQuery(
  walletAddress: HumanAddr | undefined | null,
): UseQueryResult<AncBalance | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { cw20 },
  } = useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.ANC_BALANCE,
      mantleEndpoint,
      mantleFetch,
      cw20.ANC,
      walletAddress ?? ('' as HumanAddr),
    ],
    queryFn,
    {
      refetchInterval: !!walletAddress && 1000 * 60 * 2,
      enabled: !!walletAddress,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return walletAddress ? result : EMPTY_QUERY_RESULT;
}
