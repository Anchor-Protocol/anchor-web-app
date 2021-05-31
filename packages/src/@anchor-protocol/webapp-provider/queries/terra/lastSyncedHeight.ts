import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { ANCHOR_QUERY_KEY } from '../../env';

const storageKey = '__anchor_last_synced_height__';

const queryFn = ({
  queryKey: [, lastSyncedHeight],
}: QueryFunctionContext<[string, () => Promise<number>]>) => {
  return lastSyncedHeight().then((blockHeight) => {
    localStorage.setItem(storageKey, blockHeight.toString());
    return blockHeight;
  });
};

export function useLastSyncedHeightQuery(): UseQueryResult<number> {
  const { lastSyncedHeight, queryErrorReporter } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.TERRA_LAST_SYNCED_HEIGHT, lastSyncedHeight],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
      placeholderData: () => {
        return +(localStorage.getItem(storageKey) ?? '0');
      },
    },
  );

  return result;
}
