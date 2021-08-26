import { HumanAddr } from '@anchor-protocol/types';
import { Airdrop, airdropCheckQuery } from '@anchor-protocol/webapp-fns';
import { airdropStageCache } from '@anchor-protocol/webapp-fns/caches/airdropStage';
import { createQueryFn } from '@libs/react-query-utils';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import {
  EMPTY_QUERY_RESULT,
  MantleFetch,
  useTerraWebapp,
} from '@libs/webapp-provider';
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
      ? airdropCheckQuery(
          airdropContract,
          connectedWallet.walletAddress,
          connectedWallet.network.chainID,
          mantleEndpoint,
          mantleFetch,
        )
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
      keepPreviousData: false,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet &&
    result.data &&
    !(airdropStageCache.get(connectedWallet.walletAddress) ?? []).includes(
      result.data.stage,
    )
    ? result
    : EMPTY_QUERY_RESULT;
}
