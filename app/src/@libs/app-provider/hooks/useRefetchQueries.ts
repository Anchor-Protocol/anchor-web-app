import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { TxRefetchMap } from '..';
import { useApp } from '../contexts/app';
import { QueryRefetch } from '../types';

function runRefetch(queryRefetch: string | QueryRefetch): Promise<string> {
  return new Promise<string>((resolve) => {
    if (typeof queryRefetch === 'string') {
      //resolve(queryRefetch)
      // FIXME <Ian Lee> Data that has not been updated
      //  at the time of Query call immediately after Tx completion is coming.
      //  In order to update the data normally, a delay of 200 ms is set.
      setTimeout(() => {
        resolve(queryRefetch);
      }, 200);
    } else if (typeof queryRefetch.wait === 'number') {
      setTimeout(() => {
        resolve(queryRefetch.queryKey);
      }, queryRefetch.wait);
    } else {
      resolve(queryRefetch.queryKey);
    }
  });
}

export function useRefetchQueries(refetchMap?: TxRefetchMap) {
  const queryClient = useQueryClient();

  const { refetchMap: terraRefetchMap } = useApp();

  return useCallback(
    (txKey: string) => {
      const queryRefetches = (refetchMap ?? terraRefetchMap)[txKey];

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
    [queryClient, refetchMap, terraRefetchMap],
  );
}
