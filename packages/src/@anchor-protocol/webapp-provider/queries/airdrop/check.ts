import { HumanAddr } from '@anchor-protocol/types';
import { Airdrop, airdropCheckQuery } from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import {
  EMPTY_QUERY_RESULT,
  MantleFetch,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, mantleEndpoint, mantleFetch, airdropContract, connectedWallet],
}: QueryFunctionContext<
  [string, string, MantleFetch, HumanAddr, ConnectedWallet | undefined]
>) => {
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
    : undefined;
};

export function useAirdropCheckQuery(): UseQueryResult<Airdrop | undefined> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

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
      enabled: !browserInactive && !!connectedWallet,
      keepPreviousData: true,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
