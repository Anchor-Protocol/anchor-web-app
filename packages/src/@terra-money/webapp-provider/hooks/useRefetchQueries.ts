import { TERRA_QUERY_KEY } from '@terra-money/webapp-fns';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useBank } from '../contexts/bank';
import { useTerraWebapp } from '../contexts/context';

export function useRefetchQueries() {
  const queryClient = useQueryClient();

  const { txRefetchMap } = useTerraWebapp();
  const { refetchTax, refetchTokenBalances } = useBank();

  return useCallback(
    (txKey: string) => {
      const queryKeys = txRefetchMap[txKey];

      if (queryKeys) {
        for (const queryKey of queryKeys) {
          switch (queryKey) {
            case TERRA_QUERY_KEY.TOKEN_BALANCES:
              refetchTokenBalances();
              break;
            case TERRA_QUERY_KEY.TAX:
              refetchTax();
              break;
            default:
              queryClient.invalidateQueries(queryKey, {
                refetchActive: true,
                refetchInactive: false,
              });
              break;
          }
        }
      }
    },
    [queryClient, refetchTax, refetchTokenBalances, txRefetchMap],
  );
}
