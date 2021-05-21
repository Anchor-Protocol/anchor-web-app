import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { MantleFetch, nativeTokenBalancesQuery } from '@terra-money/webapp-fns';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

interface Props {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
}

interface Result {
  nativeTokenBalances: Record<string, string>;
  refetchNativeTokenBalances: () => Promise<Record<string, string>>;
}

export function useNativeTokenBalances({
  mantleFetch,
  mantleEndpoint,
}: Props): Result {
  const connectedWallet = useConnectedWallet();

  const { browserInactive } = useBrowserInactive();

  const { data, refetch } = useQuery(
    ['NATIVE_TOKEN_BALANCES', mantleEndpoint, mantleFetch],
    () => {
      return nativeTokenBalancesQuery({
        mantleEndpoint,
        mantleFetch,
        variables: {
          walletAddress: connectedWallet?.walletAddress ?? '',
        },
      });
    },
    {
      refetchInterval: browserInactive && !!connectedWallet && 1000 * 60 * 5,
      enabled: !browserInactive && !!connectedWallet,
      keepPreviousData: true,
    },
  );

  return useMemo(() => {
    return connectedWallet && !!data
      ? {
          nativeTokenBalances: data,
          refetchNativeTokenBalances: () =>
            refetch().then(({ data }) => data ?? {}),
        }
      : {
          nativeTokenBalances: {},
          refetchNativeTokenBalances: () => Promise.resolve({}),
        };
  }, [connectedWallet, data, refetch]);
}
