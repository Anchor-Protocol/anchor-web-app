import { CW20Addr, HumanAddr } from '@anchor-protocol/types';
import {
  RewardsClaimableUstBorrowRewards,
  rewardsClaimableUstBorrowRewardsQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import {
  EMPTY_QUERY_RESULT,
  MantleFetch,
  useTerraWebapp,
} from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    lastSyncedHeight: () => Promise<number>,
    ancContract: CW20Addr,
    marketContract: HumanAddr,
    connectedWallet: ConnectedWallet | undefined,
  ) => {
    return !!connectedWallet
      ? rewardsClaimableUstBorrowRewardsQuery({
          mantleEndpoint,
          mantleFetch,
          lastSyncedHeight,
          wasmQuery: {
            borrowerInfo: {
              contractAddress: marketContract,
              query: {
                borrower_info: {
                  borrower: connectedWallet.walletAddress,
                  block_height: -1,
                },
              },
            },
            marketState: {
              contractAddress: marketContract,
              query: {
                state: {},
              },
            },
            userANCBalance: {
              contractAddress: ancContract,
              query: {
                balance: {
                  address: connectedWallet.walletAddress,
                },
              },
            },
          },
        })
      : Promise.resolve(undefined);
  },
);

export function useRewardsClaimableUstBorrowRewardsQuery(): UseQueryResult<
  RewardsClaimableUstBorrowRewards | undefined
> {
  const { mantleFetch, mantleEndpoint, lastSyncedHeight, queryErrorReporter } =
    useTerraWebapp();

  const connectedWallet = useConnectedWallet();

  const {
    contractAddress: { cw20, moneyMarket },
  } = useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.REWARDS_CLAIMABLE_UST_BORROW_REWARDS,
      mantleEndpoint,
      mantleFetch,
      lastSyncedHeight,
      cw20.ANC,
      moneyMarket.market,
      connectedWallet,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      enabled: !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
