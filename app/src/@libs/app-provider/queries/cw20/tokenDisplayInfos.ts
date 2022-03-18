import { useDeploymentTarget } from '@anchor-protocol/app-provider';
import {
  CW20TokenDisplayInfos,
  cw20TokenDisplayInfosQuery,
} from '@libs/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useAnchorQuery } from 'queries';
import { UseQueryResult } from 'react-query';
import { TERRA_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(cw20TokenDisplayInfosQuery);

export function useCW20TokenDisplayInfosQuery(): UseQueryResult<CW20TokenDisplayInfos> {
  const {
    target: { chain },
  } = useDeploymentTarget();

  const result = useAnchorQuery(
    [TERRA_QUERY_KEY.CW20_TOKEN_DISPLAY_INFOS, chain],
    queryFn,
    {
      keepPreviousData: false,
      refetchOnMount: false,
    },
  );

  return result;
}
