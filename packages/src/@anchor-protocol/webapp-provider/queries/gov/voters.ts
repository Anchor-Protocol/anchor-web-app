import { anchorToken } from '@anchor-protocol/types';
import { govVotersQuery } from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '../../contexts/context';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useCallback, useEffect, useState } from 'react';

const limit = 10;

interface VotersReturn {
  voters: anchorToken.gov.Voter[];
  isLast: boolean;
  loadMore: () => void;
  reload: () => void;
}

export function useGovVotersQuery(pollId?: number): VotersReturn {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { anchorToken },
  } = useAnchorWebapp();

  const [voters, setVoters] = useState<anchorToken.gov.Voter[]>([]);

  const [isLast, setIsLast] = useState<boolean>(false);

  const load = useCallback(() => {
    // initialize data
    setIsLast(false);
    setVoters([]);

    if (typeof pollId !== 'number') {
      return;
    }

    govVotersQuery({
      mantleEndpoint,
      mantleFetch,
      variables: {
        govContract: anchorToken.gov,
        votersQuery: {
          voters: {
            poll_id: pollId,
            limit,
          },
        },
      },
    })
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
    anchorToken.gov,
    mantleEndpoint,
    mantleFetch,
    pollId,
    queryErrorReporter,
  ]);

  const loadMore = useCallback(() => {
    if (typeof pollId !== 'number') {
      return;
    }

    if (voters.length > 0) {
      govVotersQuery({
        mantleEndpoint,
        mantleFetch,
        variables: {
          govContract: anchorToken.gov,
          votersQuery: {
            voters: {
              poll_id: pollId,
              limit,
              start_after: voters[voters.length - 1].voter,
            },
          },
        },
      })
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
    anchorToken.gov,
    mantleEndpoint,
    mantleFetch,
    pollId,
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
