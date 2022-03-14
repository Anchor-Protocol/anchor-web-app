import { catchError, OperatorFunction } from 'rxjs';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { errorContains, formatError, TxError } from './utils';

interface CatchTxErrorParams {
  txErrorReporter?: (error: unknown) => string;
}

const catchTxError = <TxResult>(
  params: CatchTxErrorParams,
): OperatorFunction<TxResultRendering<TxResult>, any> => {
  const { txErrorReporter } = params;

  return catchError((error) => {
    const errorId = txErrorReporter ? txErrorReporter(error) : error.message;

    if (errorContains(error, TxError.TxAlreadyProcessed)) {
      return Promise.resolve<TxResultRendering>({
        value: null,
        phase: TxStreamPhase.SUCCEED,
        receipts: [],
      });
    }

    if (errorContains(error, TxError.TxInvalid)) {
      return formatTxErrorResult(error, errorId, TxError.TxInvalid);
    }

    if (errorContains(error, TxError.TxHashInvalid)) {
      return formatTxErrorResult(error, errorId, TxError.TxHashInvalid);
    }

    return Promise.resolve<TxResultRendering>({
      value: null,
      phase: TxStreamPhase.FAILED,
      failedReason: { error: error?.data?.message ?? error?.message, errorId },
      receipts: [],
    });
  });
};

const formatTxErrorResult = (error: any, errorId: any, txError: TxError) => {
  return Promise.resolve<TxResultRendering>({
    value: null,
    phase: TxStreamPhase.FAILED,
    failedReason: { error: formatError(error, txError), errorId },
    receipts: [],
  });
};

export { catchTxError };
