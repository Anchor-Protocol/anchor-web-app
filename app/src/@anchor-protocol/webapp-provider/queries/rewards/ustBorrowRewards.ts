import { HumanAddr } from '@anchor-protocol/types';
import {
  RewardsUstBorrowRewards,
  rewardsUstBorrowRewardsQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@packages/react-query-utils';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import {
  EMPTY_QUERY_RESULT,
  MantleFetch,
  useTerraWebapp,
} from '@packages/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    marketContract: HumanAddr,
    connectedWallet: ConnectedWallet | undefined,
  ) => {
    return !!connectedWallet
      ? rewardsUstBorrowRewardsQuery({
          mantleEndpoint,
          mantleFetch,
          wasmQuery: {
            marketState: {
              contractAddress: marketContract,
              query: {
                state: {},
              },
            },
            borrowerInfo: {
              contractAddress: marketContract,
              query: {
                borrower_info: {
                  borrower: connectedWallet.walletAddress,
                },
              },
            },
          },
        })
      : Promise.resolve(undefined);
  },
);

export function useRewardsUstBorrowRewardsQuery(): UseQueryResult<
  RewardsUstBorrowRewards | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const connectedWallet = useConnectedWallet();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.REWARDS_UST_BORROW_REWARDS,
      mantleEndpoint,
      mantleFetch,
      moneyMarket.market,
      connectedWallet,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 1,
      enabled: !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
