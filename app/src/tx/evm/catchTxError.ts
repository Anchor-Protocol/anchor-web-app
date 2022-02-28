import { catchError, OperatorFunction } from 'rxjs';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';

interface CatchTxErrorParams {
  txErrorReporter?: (error: unknown) => string;
}

const catchTxError = <TxResult>(
  params: CatchTxErrorParams,
): OperatorFunction<TxResultRendering<TxResult>, any> => {
  const { txErrorReporter } = params;
  return catchError((error) => {
    const errorId = txErrorReporter ? txErrorReporter(error) : error.message;

    return Promise.resolve<TxResultRendering>({
      value: null,
      phase: TxStreamPhase.FAILED,
      failedReason: { error, errorId },
      receipts: [],
    });
  });
};

export { catchTxError };
