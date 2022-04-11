import { millisecondsInHour } from 'date-fns';
import { useBlockQuery } from './useBlockQuery';

const refetchInterval = millisecondsInHour * 24;

export const useEstimatedBlockTime = (delta = 100) => {
  const { data: latestBlock } = useBlockQuery('latest', { refetchInterval });
  const { data: oldBlock } = useBlockQuery(
    latestBlock ? latestBlock.height - delta : undefined,
    { refetchInterval },
  );

  if (latestBlock === undefined || oldBlock === undefined) {
    return;
  }

  return (latestBlock?.timestamp - oldBlock.timestamp) / delta;
};
