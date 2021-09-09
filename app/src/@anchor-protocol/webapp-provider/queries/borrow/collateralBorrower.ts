import { CW20Addr, HumanAddr } from '@anchor-protocol/types';
import {
  BorrowCollateralBorrower,
  borrowCollateralBorrowerQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import { MantleFetch } from '@libs/mantle';
import { EMPTY_QUERY_RESULT, useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    connectedWallet: ConnectedWallet | undefined,
    custodyContract: HumanAddr,
  ) => {
    return !!connectedWallet
      ? borrowCollateralBorrowerQuery({
          mantleEndpoint,
          mantleFetch,
          wasmQuery: {
            custodyBorrower: {
              contractAddress: custodyContract,
              query: {
                borrower: {
                  address: connectedWallet.walletAddress,
                },
              },
            },
          },
        })
      : Promise.resolve(undefined);
  },
);

export function useBorrowCollateralBorrowerQuery(
  collateralToken: CW20Addr,
): UseQueryResult<BorrowCollateralBorrower | undefined> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BORROW_COLLATERAL_BORROWER,
      mantleEndpoint,
      mantleFetch,
      connectedWallet,
      moneyMarket.collateralsArray.find(
        ({ token }) => token === collateralToken,
      )!.custody,
    ],
    queryFn,
    {
      refetchInterval: !!connectedWallet && 1000 * 60 * 5,
      enabled: !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
