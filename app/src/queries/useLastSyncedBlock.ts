import { ANCHOR_QUERY_KEY } from '@anchor-protocol/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { UseQueryResult } from 'react-query';
import { useAnchorQuery } from './useAnchorQuery';
import { LcdQueryClient } from '@libs/query-client';
import { useApp } from '@libs/app-provider';
import { ISODateFormat, Num } from '@libs/types';

interface Block {
  timestamp: number;
  height: number;
}

interface LcdBlocksLatest {
  block: {
    header: {
      height: Num;
      time: ISODateFormat;
    };
  };
}

export const lastSyncedBlockQuery = async (
  lcdQueryClient: LcdQueryClient,
): Promise<Block> => {
  const {
    block: {
      header: { height, time },
    },
  } = await lcdQueryClient.lcdFetcher<LcdBlocksLatest>(
    `${lcdQueryClient.lcdEndpoint}/blocks/latest`,
    lcdQueryClient.requestInit,
  );

  return {
    height: Number(height),
    timestamp: new Date(time).getTime(),
  };
};

const lastSyncedBlockQueryFn = createQueryFn(lastSyncedBlockQuery);

export const useLastSyncedBlock = (): UseQueryResult<Block> => {
  const { lcdQueryClient } = useApp();

  return useAnchorQuery(
    [ANCHOR_QUERY_KEY.LAST_SYNCED_BLOCK, lcdQueryClient],
    lastSyncedBlockQueryFn,
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
    },
  );
};
