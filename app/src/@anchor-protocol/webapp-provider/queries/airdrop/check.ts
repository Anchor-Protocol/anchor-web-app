import { HumanAddr } from '@anchor-protocol/types';
import { Airdrop, airdropCheckQuery } from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import {
  EMPTY_QUERY_RESULT,
  MantleFetch,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    airdropContract: HumanAddr,
    connectedWallet: ConnectedWallet | undefined,
  ) => {
    return connectedWallet &&
      connectedWallet.network.chainID.startsWith('columbus')
      ? airdropCheckQuery({
          mantleEndpoint,
          mantleFetch,
          variables: {
            airdropContract,
            chainId: connectedWallet.network.chainID,
            walletAddress: connectedWallet.walletAddress,
          },
        })
      : Promise.resolve(undefined);
  },
);

export function useAirdropCheckQuery(): UseQueryResult<Airdrop | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const connectedWallet = useConnectedWallet();

  const {
    contractAddress: { bluna },
  } = useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.AIRDROP_CHECK,
      mantleEndpoint,
      mantleFetch,
      bluna.airdropRegistry,
      connectedWallet,
    ],
    queryFn,
    {
      enabled: !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
