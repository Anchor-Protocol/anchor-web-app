import { Airdrop, airdropCheckQuery } from '@anchor-protocol/app-fns';
import { airdropStageCache } from '@anchor-protocol/app-fns/caches/airdropStage';
import { useNetwork } from '@anchor-protocol/app-provider';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(airdropCheckQuery);

export function useAirdropCheckQuery(): UseQueryResult<Airdrop | undefined> {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const { connected, terraWalletAddress } = useAccount();

  const { network } = useNetwork();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.AIRDROP_CHECK,
      terraWalletAddress,
      contractAddress.bluna.airdropRegistry,
      network.chainID,
      queryClient,
    ],
    queryFn,
    {
      enabled: connected,
      keepPreviousData: false,
      onError: queryErrorReporter,
    },
  );

  return terraWalletAddress &&
    result.data &&
    !(airdropStageCache.get(terraWalletAddress) ?? []).includes(
      result.data.stage,
    )
    ? result
    : EMPTY_QUERY_RESULT;
}
