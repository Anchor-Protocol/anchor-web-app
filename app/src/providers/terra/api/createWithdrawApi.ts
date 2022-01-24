// return earnWithdrawTx({
//   // fabricateMarketReedeemStableCoin
//   address: connectedWallet.walletAddress,
//   market: MARKET_DENOMS.UUSD,
//   amount: withdrawAmount,
//   // post
//   network: connectedWallet.network,
//   post: connectedWallet.post,
//   txFee,
//   gasFee: constants.gasWanted,
//   gasAdjustment: constants.gasAdjustment,
//   addressProvider,
//   // query
//   queryClient,
//   // error
//   txErrorReporter,
//   // side effect
//   onTxSucceed: () => {
//     onTxSucceed?.();
//     refetchQueries(ANCHOR_TX_KEY.EARN_WITHDRAW);
//   },
// });

// export const withdraw = (
//   params: AnchorWithdrawParams,
// ): Observable<TxResultRendering> => {
//   const observable = pipe<void, TxResultRendering>(() => {
//     return {
//       value: null,
//       phase: TxStreamPhase.SUCCEED,
//       receipts: [
//         {
//           name: 'Withdraw Amount',
//           value: '100.50 UST',
//         },
//       ],
//     };
//   });
//   return observable();
// };

//import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { AnchorWithdrawParams } from 'contexts/api';
//import { pipe } from 'rxjs';
import { TxObservableFnDependencies, TxObservableFn } from './common';

export const createWithdrawApi = (
  dependencies: TxObservableFnDependencies,
): TxObservableFn<AnchorWithdrawParams> => {
  // const {
  //   // constants,
  //   // connectedWallet,
  //   // addressProvider,
  //   // queryClient,
  //   // txErrorReporter,
  //   // refetchQueries,
  // } = dependencies;
  return (params: AnchorWithdrawParams) => {
    // const observable = pipe<void, TxResultRendering>(() => {
    //   return {
    //     value: null,
    //     phase: TxStreamPhase.SUCCEED,
    //     receipts: [
    //       {
    //         name: 'Withdraw Amount',
    //         value: '100.50 UST',
    //       },
    //     ],
    //   };
    // });
    // return observable();
    throw new Error('');
  };
};
