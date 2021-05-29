import { CW20Addr, HumanAddr } from '@anchor-protocol/types';
import { AncBalanceData, ancBalanceQuery } from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
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
  walletAddress: HumanAddr,
): UseQueryResult<AncBalanceData | undefined> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

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
      walletAddress,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
    },
  );

  return result;
}
