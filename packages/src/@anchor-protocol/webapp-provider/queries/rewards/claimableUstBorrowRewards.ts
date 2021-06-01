import { CW20Addr, HumanAddr } from '@anchor-protocol/types';
import {
  RewardsClaimableUstBorrowRewardsData,
  rewardsClaimableUstBorrowRewardsQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import {
  EMPTY_QUERY_RESULT,
  MantleFetch,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [
    ,
    mantleEndpoint,
    mantleFetch,
    lastSyncedHeight,
    ancContract,
    marketContract,
    connectedWallet,
  ],
}: QueryFunctionContext<
  [
    string,
    string,
    MantleFetch,
    () => Promise<number>,
    CW20Addr,
    HumanAddr,
    ConnectedWallet | undefined,
  ]
>) => {
  return !!connectedWallet
    ? rewardsClaimableUstBorrowRewardsQuery({
        mantleEndpoint,
        mantleFetch,
        lastSyncedHeight,
        variables: {
          ancContract,
          marketContract,
          borrowerInfoQuery: {
            borrower_info: {
              borrower: connectedWallet.walletAddress,
              block_height: -1,
            },
          },
          marketStateQuery: {
            state: {},
          },
          userAncBalanceQuery: {
            balance: {
              address: connectedWallet.walletAddress,
            },
          },
        },
      })
    : Promise.resolve(undefined);
};

export function useRewardsClaimableUstBorrowRewardsQuery(): UseQueryResult<
  RewardsClaimableUstBorrowRewardsData | undefined
> {
  const {
    mantleFetch,
    mantleEndpoint,
    lastSyncedHeight,
    queryErrorReporter,
  } = useTerraWebapp();

  const connectedWallet = useConnectedWallet();

  const {
    contractAddress: { cw20, moneyMarket },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

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
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive && !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
