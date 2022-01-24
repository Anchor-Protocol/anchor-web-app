import { useStream } from '@rx-stream/react';
import { useAccount } from 'contexts/account';
import { useAnchorApi } from 'contexts/api';

// export interface EarnWithdrawTxParams {
//   withdrawAmount: aUST;
//   txFee: u<UST>;
//   onTxSucceed?: () => void;
// }

// export function useEarnWithdrawTx() {
//   const connectedWallet = useConnectedWallet();

//   const { addressProvider, constants, queryClient, txErrorReporter } =
//     useAnchorWebapp();

//   const refetchQueries = useRefetchQueries();

//   const stream = useCallback(
//     ({ withdrawAmount, txFee, onTxSucceed }: EarnWithdrawTxParams) => {
//       if (!connectedWallet || !connectedWallet.availablePost) {
//         throw new Error('Can not post!');
//       }

//       return earnWithdrawTx({
//         // fabricateMarketReedeemStableCoin
//         address: connectedWallet.walletAddress,
//         market: MARKET_DENOMS.UUSD,
//         amount: withdrawAmount,
//         // post
//         network: connectedWallet.network,
//         post: connectedWallet.post,
//         txFee,
//         gasFee: constants.gasWanted,
//         gasAdjustment: constants.gasAdjustment,
//         addressProvider,
//         // query
//         queryClient,
//         // error
//         txErrorReporter,
//         // side effect
//         onTxSucceed: () => {
//           onTxSucceed?.();
//           refetchQueries(ANCHOR_TX_KEY.EARN_WITHDRAW);
//         },
//       });
//     },
//     [
//       connectedWallet,
//       constants.gasWanted,
//       constants.gasAdjustment,
//       addressProvider,
//       queryClient,
//       txErrorReporter,
//       refetchQueries,
//     ],
//   );

//   const streamReturn = useStream(stream);

//   return connectedWallet ? streamReturn : [null, null];
// }

export function useEarnWithdrawTx() {
  const { connected } = useAccount();

  const { withdraw } = useAnchorApi();

  const streamReturn = useStream(withdraw);

  return connected ? streamReturn : [null, null];
}
