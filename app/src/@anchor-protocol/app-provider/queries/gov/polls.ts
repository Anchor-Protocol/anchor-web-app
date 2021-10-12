import { anchorToken } from '@anchor-protocol/types';
import { govPollsQuery } from '@anchor-protocol/app-fns';
import { useCallback, useEffect, useState } from 'react';
import { useAnchorWebapp } from '../../contexts/context';

const limit = 6;

interface PollsReturn {
  polls: anchorToken.gov.PollResponse[];
  isLast: boolean;
  loadMore: () => void;
  reload: () => void;
}

// TODO use react-query infinite sroll
export function useGovPollsQuery(
  filter: anchorToken.gov.PollStatus | undefined,
): PollsReturn {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const [polls, setPolls] = useState<anchorToken.gov.PollResponse[]>([]);

  const [isLast, setIsLast] = useState<boolean>(false);

  const load = useCallback(() => {
    // initialize data
    setIsLast(false);
    setPolls([]);

    govPollsQuery(
      contractAddress.anchorToken.gov,
      {
        filter,
        limit,
      },
      queryClient,
    )
      .then(({ polls }) => {
        if (polls.polls.length > 0) {
          setPolls(polls.polls);
        }

        if (polls.polls.length < limit) {
          setIsLast(true);
        }
      })
      .catch(queryErrorReporter);
  }, [
    contractAddress.anchorToken.gov,
    filter,
    queryClient,
    queryErrorReporter,
  ]);

  const loadMore = useCallback(() => {
    if (polls.length > 0) {
      govPollsQuery(
        contractAddress.anchorToken.gov,
        {
          filter,
          limit,
          start_after: polls[polls.length - 1].id,
        },
        queryClient,
      )
        .then(({ polls }) => {
          if (polls.polls) {
            setPolls((prev) => {
              return Array.isArray(polls.polls) && polls.polls.length > 0
                ? [...prev, ...polls.polls]
                : prev;
            });

            if (polls.polls.length < limit) {
              setIsLast(true);
            }
          }
        })
        .catch(queryErrorReporter);
    }
  }, [
    contractAddress.anchorToken.gov,
    filter,
    polls,
    queryClient,
    queryErrorReporter,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    polls,
    isLast,
    loadMore,
    reload: load,
  };
}
