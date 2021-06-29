import { anchorToken } from '@anchor-protocol/types';
import { govPollsQuery } from '@anchor-protocol/webapp-fns';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useCallback, useEffect, useState } from 'react';
import { useAnchorWebapp } from '../../contexts/context';

const limit = 6;

interface PollsReturn {
  polls: anchorToken.gov.PollResponse[];
  isLast: boolean;
  loadMore: () => void;
  reload: () => void;
}

export function useGovPollsQuery(
  filter: anchorToken.gov.PollStatus | undefined,
): PollsReturn {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { anchorToken },
  } = useAnchorWebapp();

  const [polls, setPolls] = useState<anchorToken.gov.PollResponse[]>([]);

  const [isLast, setIsLast] = useState<boolean>(false);

  const load = useCallback(() => {
    // initialize data
    setIsLast(false);
    setPolls([]);

    govPollsQuery({
      mantleEndpoint,
      mantleFetch,
      wasmQuery: {
        polls: {
          contractAddress: anchorToken.gov,
          query: {
            polls: {
              filter,
              limit,
            },
          },
        },
      },
    })
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
    anchorToken.gov,
    filter,
    mantleEndpoint,
    mantleFetch,
    queryErrorReporter,
  ]);

  const loadMore = useCallback(() => {
    if (polls.length > 0) {
      govPollsQuery({
        mantleEndpoint,
        mantleFetch,
        wasmQuery: {
          polls: {
            contractAddress: anchorToken.gov,
            query: {
              polls: {
                filter,
                limit,
                start_after: polls[polls.length - 1].id,
              },
            },
          },
        },
      })
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
    anchorToken.gov,
    filter,
    mantleEndpoint,
    mantleFetch,
    polls,
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
