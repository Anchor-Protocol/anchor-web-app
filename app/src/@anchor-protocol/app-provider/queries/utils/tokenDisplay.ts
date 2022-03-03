import { useNetwork } from '@anchor-protocol/app-provider';
import { CW20TokenDisplayInfo } from '@libs/app-fns';
import {
  EMPTY_QUERY_RESULT,
  useCW20TokenDisplayInfosQuery,
} from '@libs/app-provider';
import { useMemo } from 'react';
import { UseQueryResult } from 'react-query';

export type TokenDisplayInfoByAddr = {
  [tokenAddr: string]: CW20TokenDisplayInfo;
};
type UnitOrArrayWithTokenDisplay<Data, DataWithTokenDisplay> =
  Data extends Array<any> ? DataWithTokenDisplay[] : DataWithTokenDisplay;

export const useQueryWithTokenDisplay = <Data, DataWithTokenDisplay>(
  queryResult: UseQueryResult<Data | undefined>,
  withTokenDisplay: (
    data: Data,
    tokenDisplayInfoByAddr: TokenDisplayInfoByAddr,
  ) => UnitOrArrayWithTokenDisplay<Data, DataWithTokenDisplay>,
): UseQueryResult<
  UnitOrArrayWithTokenDisplay<Data, DataWithTokenDisplay> | undefined
> => {
  const { network } = useNetwork();
  const tokenDisplayInfos = useCW20TokenDisplayInfosQuery();

  return useMemo(() => {
    if (!queryResult.data || !tokenDisplayInfos.data) {
      return EMPTY_QUERY_RESULT;
    }
    return {
      ...queryResult,
      data: withTokenDisplay(
        queryResult.data,
        tokenDisplayInfos.data[network.name],
      ),
    } as UseQueryResult<
      UnitOrArrayWithTokenDisplay<Data, DataWithTokenDisplay> | undefined
    >;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryResult.data, tokenDisplayInfos.data, network.name]);
};
