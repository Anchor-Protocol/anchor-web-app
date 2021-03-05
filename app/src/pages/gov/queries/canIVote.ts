import { useApolloClient } from '@apollo/client';
import { useContractAddress } from 'contexts/contract';
import { useService } from 'contexts/service';
import { queryVoters } from 'pages/gov/queries/voters';
import { useEffect, useState } from 'react';

export function useCanIVote(pollId: number | undefined): boolean {
  const client = useApolloClient();

  const { walletReady } = useService();

  const address = useContractAddress();

  const [canIVote, setCanIVote] = useState<boolean>(false);

  useEffect(() => {
    setCanIVote(false);

    if (typeof pollId === 'number' && walletReady) {
      queryVoters(client, address, pollId, walletReady.walletAddress, 1).then(
        ({ data }) => {
          setCanIVote(!!data.voters && data.voters.voters.length === 0);
        },
      );
    }
  }, [address, client, pollId, walletReady]);

  return canIVote;
}
