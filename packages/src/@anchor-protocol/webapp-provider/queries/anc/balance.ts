import { CW20Addr, HumanAddr } from '@anchor-protocol/types';
import { AncBalanceData, ancBalanceQuery } from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import {
  EMPTY_QUERY_RESULT,
  MantleFetch,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, mantleEndpoint, mantleFetch, ancContract, walletAddress],
}: QueryFunctionContext<
  [string, string, MantleFetch, CW20Addr, HumanAddr]
>) => {
  return ancBalanceQuery({
    mantleEndpoint,
    mantleFetch,
    variables: {
      ancContract,
      balanceQuery: {
        balance: {
          address: walletAddress,
        },
      },
    },
  });
};

export function useAncBalanceQuery(
  walletAddress: HumanAddr | undefined | null,
): UseQueryResult<AncBalanceData | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { cw20 },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

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
      refetchInterval: browserInactive && !!walletAddress && 1000 * 60 * 5,
      enabled: !browserInactive || !walletAddress,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return walletAddress ? result : EMPTY_QUERY_RESULT;
}
