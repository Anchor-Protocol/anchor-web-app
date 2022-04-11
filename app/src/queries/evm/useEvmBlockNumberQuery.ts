import { useAnchorWebapp } from '@anchor-protocol/app-provider/contexts/context';
import { ANCHOR_QUERY_KEY } from '@anchor-protocol/app-provider/env';
import { useEvmWallet } from '@libs/evm-wallet';
import { useQuery } from 'react-query';

export function useEvmBlockNumberQuery() {
  const { provider } = useEvmWallet();
  const { queryErrorReporter } = useAnchorWebapp();

  return useQuery(
    [ANCHOR_QUERY_KEY.EVM_BLOCK_NUMBER, provider?.network?.chainId],
    async () => {
      const blockNumber = await provider?.getBlockNumber();

      return blockNumber;
    },
    {
      refetchInterval: 1000 * 60,
      keepPreviousData: false,
      onError: queryErrorReporter,
    },
  );
}
