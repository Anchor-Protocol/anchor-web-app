import { ANCHOR_QUERY_KEY } from '@anchor-protocol/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { UseQueryResult } from 'react-query';
import { useAnchorQuery } from './useAnchorQuery';
import { LcdQueryClient } from '@libs/query-client';
import { useApp } from '@libs/app-provider';
import { ISODateFormat, Num } from '@libs/types';
import { millisecondsInMinute, millisecondsInHour } from 'date-fns';

interface Block {
  timestamp: number;
  height: number;
}

interface LcdBlock {
  block: {
    header: {
      height: Num;
      time: ISODateFormat;
    };
  };
}

type BlockQueryId = number | 'latest';

export const blockQuery = async (
  lcdQueryClient: LcdQueryClient,
  blockQueryId: BlockQueryId = 'latest',
): Promise<Block> => {
  const {
    block: {
      header: { height, time },
    },
  } = await lcdQueryClient.lcdFetcher<LcdBlock>(
    `${lcdQueryClient.lcdEndpoint}/blocks/${blockQueryId}`,
    lcdQueryClient.requestInit,
  );

  return {
    height: Number(height),
    timestamp: new Date(time).getTime(),
  };
};

const blockQueryFn = createQueryFn(blockQuery);

interface UseBlockQueryOptions {
  refetchInterval?: number;
}

export const useBlockQuery = (
  blockQueryId?: BlockQueryId,
  options: UseBlockQueryOptions = {},
): UseQueryResult<Block> => {
  const { lcdQueryClient } = useApp();

  // no need to refetch old blocks
  const defaultRefetchInterval =
    blockQueryId === 'latest' ? millisecondsInMinute : millisecondsInHour * 24;

  return useAnchorQuery(
    [ANCHOR_QUERY_KEY.BLOCK, lcdQueryClient, blockQueryId],
    blockQueryFn,
    {
      refetchOnMount: false,
      refetchInterval: defaultRefetchInterval,
      enabled: !!blockQueryId,
      keepPreviousData: true,
      ...options,
    },
  );
};
