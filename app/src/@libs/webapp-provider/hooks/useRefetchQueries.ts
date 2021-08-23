import { TERRA_QUERY_KEY } from '@libs/webapp-fns';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useBank } from '../contexts/bank';
import { useTerraWebapp } from '../contexts/context';
import { QueryRefetch } from '../types';

function runRefetch(queryRefetch: string | QueryRefetch): Promise<string> {
  return new Promise<string>((resolve) => {
    if (typeof queryRefetch === 'string') {
      resolve(queryRefetch);
    } else if (typeof queryRefetch.wait === 'number') {
      setTimeout(() => resolve(queryRefetch.queryKey), queryRefetch.wait);
    } else {
      resolve(queryRefetch.queryKey);
    }
  });
}

export function useRefetchQueries() {
  const queryClient = useQueryClient();

  const { txRefetchMap } = useTerraWebapp();
  const { refetchTax, refetchTokenBalances } = useBank();

  return useCallback(
    (txKey: string) => {
      const queryRefetches = txRefetchMap[txKey];

      if (queryRefetches) {
        for (const queryRefetch of queryRefetches) {
          switch (queryRefetch) {
            case TERRA_QUERY_KEY.TOKEN_BALANCES:
              refetchTokenBalances();
              break;
            case TERRA_QUERY_KEY.TAX:
              refetchTax();
              break;
            default:
              runRefetch(queryRefetch).then((queryKey) => {
                queryClient.invalidateQueries(queryKey, {
                  refetchActive: true,
                  refetchInactive: false,
                });
              });
              break;
          }
        }
      }
    },
    [queryClient, refetchTax, refetchTokenBalances, txRefetchMap],
  );
}
