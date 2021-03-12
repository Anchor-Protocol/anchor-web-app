import { useSubscription } from '@terra-dev/broadcastable-operation';
import { useRewardsAncGovernance } from 'pages/gov/queries/rewardsAncGovernance';
import { useMemo } from 'react';

export function useCanIVote(pollId: number | undefined): boolean {
  //const client = useApolloClient();
  //
  //const { walletReady } = useService();
  //
  //const address = useContractAddress();
  //
  //const [canIVote, setCanIVote] = useState<boolean>(false);
  //
  //useEffect(() => {
  //  setCanIVote(false);
  //
  //  if (typeof pollId === 'number' && walletReady) {
  //    queryVoters(client, address, pollId, walletReady.walletAddress, 1).then(
  //      ({ data }) => {
  //        console.log('canIVote.ts..()', data.voters);
  //        setCanIVote(!!data.voters && data.voters.voters.length === 0);
  //      },
  //    );
  //  }
  //}, [address, client, pollId, walletReady]);
  //
  //return canIVote;

  const {
    data: { userGovStakingInfo },
    refetch,
  } = useRewardsAncGovernance();

  useSubscription((id, event) => {
    if (event === 'done') {
      refetch();
    }
  });

  return useMemo(() => {
    if (!pollId || !userGovStakingInfo) return false;

    for (const [stakedPollId] of userGovStakingInfo.locked_balance) {
      if (pollId === stakedPollId) return false;
    }

    return true;
  }, [pollId, userGovStakingInfo]);
}
