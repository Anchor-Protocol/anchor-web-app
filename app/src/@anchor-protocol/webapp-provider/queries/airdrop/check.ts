import { Airdrop, airdropCheckQuery } from '@anchor-protocol/webapp-fns';
import { airdropStageCache } from '@anchor-protocol/webapp-fns/caches/airdropStage';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useConnectedWallet, useWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(airdropCheckQuery);

export function useAirdropCheckQuery(): UseQueryResult<Airdrop | undefined> {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const connectedWallet = useConnectedWallet();

  const { network } = useWallet();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.AIRDROP_CHECK,
      connectedWallet?.walletAddress,
      contractAddress.bluna.airdropRegistry,
      network.chainID,
      queryClient,
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
