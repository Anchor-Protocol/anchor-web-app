import { anchorToken } from '@anchor-protocol/types';
import { govVotersQuery } from '@anchor-protocol/app-fns';
import { useCallback, useEffect, useState } from 'react';
import { useAnchorWebapp } from '../../contexts/context';

const limit = 10;

interface VotersReturn {
  voters: anchorToken.gov.Voter[];
  isLast: boolean;
  loadMore: () => void;
  reload: () => void;
}

// TODO use react-query infinite scroll
export function useGovVotersQuery(pollId?: number): VotersReturn {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const [voters, setVoters] = useState<anchorToken.gov.Voter[]>([]);

  const [isLast, setIsLast] = useState<boolean>(false);

  const load = useCallback(() => {
    // initialize data
    setIsLast(false);
    setVoters([]);

    if (typeof pollId !== 'number') {
      return;
    }

    govVotersQuery(
      contractAddress.anchorToken.gov,
      {
        poll_id: pollId,
        limit,
      },
      queryClient,
    )
      .then(({ voters }) => {
        if (voters.voters) {
          if (voters.voters.length > 0) {
            setVoters(voters.voters);
          }

          if (voters.voters.length < limit) {
            setIsLast(true);
          }
        }
      })
      .catch(queryErrorReporter);
  }, [
    contractAddress.anchorToken.gov,
    pollId,
    queryClient,
    queryErrorReporter,
  ]);

  const loadMore = useCallback(() => {
    if (typeof pollId !== 'number') {
      return;
    }

    if (voters.length > 0) {
      govVotersQuery(
        contractAddress.anchorToken.gov,
        {
          poll_id: pollId,
          limit,
          start_after: voters[voters.length - 1].voter,
        },
        queryClient,
      )
        .then(({ voters }) => {
          if (voters.voters) {
            setVoters((prev) => {
              return Array.isArray(voters.voters) && voters.voters.length > 0
                ? [...prev, ...voters.voters]
                : prev;
            });

            if (voters.voters.length < limit) {
              setIsLast(true);
            }
          }
        })
        .catch(queryErrorReporter);
    }
  }, [
    contractAddress.anchorToken.gov,
    pollId,
    queryClient,
    queryErrorReporter,
    voters,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    voters,
    isLast,
    loadMore,
    reload: load,
  };
}
