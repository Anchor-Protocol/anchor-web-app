import {
  BackgroundTxResult,
  ResumeTxParams,
  ResumeTxResult,
  Transaction,
} from 'tx/evm';
import { BACKGROUND_TRANSCATION_TAB_ID } from '../BackgroundTransaction';
import { useExecuteOnceWhen } from '../utils';

export const useExecuteReservedTx = (
  tx: Transaction,
  backgroundTx: BackgroundTxResult<ResumeTxParams, ResumeTxResult> | undefined,
) => {
  const { alreadyRunning } = backgroundTx?.utils ?? {};
  const [execute] = backgroundTx?.stream ?? [null, null];

  useExecuteOnceWhen(
    () => execute!({}),
    () =>
      Boolean(execute) &&
      !alreadyRunning &&
      tx.backgroundTransactionTabId === BACKGROUND_TRANSCATION_TAB_ID,
  );
};
