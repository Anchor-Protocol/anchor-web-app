import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useApp } from '../contexts/app';
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

  const { refetchMap } = useApp();

  return useCallback(
    (txKey: string) => {
      const queryRefetches = refetchMap[txKey];

      if (queryRefetches) {
        for (const queryRefetch of queryRefetches) {
          runRefetch(queryRefetch).then((queryKey) => {
            queryClient.invalidateQueries(queryKey, {
              refetchActive: true,
              refetchInactive: false,
            });
          });
        }
      }
    },
    [queryClient, refetchMap],
  );
}
