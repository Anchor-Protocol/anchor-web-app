import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { catchError, OperatorFunction } from 'rxjs';
import { CrossAnchorTx } from '.';

interface CatchTxErrorParams {
  txErrorReporter?: (error: unknown) => string;
}

export function catchTxError(
  params: CatchTxErrorParams,
): OperatorFunction<TxResultRendering<CrossAnchorTx>, any> {
  //const { txErrorReporter } = params;
  return catchError((error, tx) => {
    // const errorId =
    //   txErrorReporter &&
    //   !(error instanceof UserDenied || error instanceof Timeout)
    //     ? txErrorReporter(error)
    //     : undefined;

    const errorId = 'Unknown';

    return Promise.resolve<TxResultRendering>({
      value: null,
      phase: TxStreamPhase.FAILED,
      failedReason: { error, errorId },
      receipts: [],
    });
  });
}
