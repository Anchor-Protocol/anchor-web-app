import { u, UST } from '@anchor-protocol/types';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { _catchTxError, TxHelper } from '@libs/app-fns/tx/internal';
import { StreamReturn, useStream } from '@rx-stream/react';
import { TxInfo } from '@terra-money/terra.js';
import { NetworkInfo } from '@terra-money/use-wallet';
import { useCallback, useMemo } from 'react';
import { BehaviorSubject, from, merge, mergeMap } from 'rxjs';

export function useRenderedTx<TxParams>($: {
  sendTx: (params: TxParams, helper: TxHelper) => Promise<TxInfo>;
  renderResults: (
    txInfo: TxInfo,
    helper: TxHelper,
    params: TxParams,
  ) => Promise<TxResultRendering>;
  network: NetworkInfo;
  txFee: string;
  txErrorReporter?: (error: unknown) => string;
}): StreamReturn<TxParams, TxResultRendering> | null[] {
  const helper = useMemo(
    () => new TxHelper({ ...$, txFee: $.txFee as u<UST> }),
    [$],
  );

  const subject = useMemo(
    () =>
      new BehaviorSubject<TxResultRendering<TxInfo | null>>({
        value: null,
        phase: TxStreamPhase.BROADCAST,
        receipts: [],
      }),
    [],
  );

  const txCallback = useCallback(
    (params: TxParams) =>
      merge(
        subject,
        from(
          (async () => {
            const result = await $.sendTx(params, helper);
            helper.setTxHash(result.txhash);
            return result;
          })(),
        ).pipe(mergeMap((txInfo) => $.renderResults(txInfo, helper, params))),
      ).pipe(_catchTxError({ helper, ...$ })),
    [$, helper, subject],
  );

  const [fetch, result] = useStream(txCallback);
  const txStreamResult = useMemo(
    () => [fetch, result] as StreamReturn<TxParams, TxResultRendering>,
    [fetch, result],
  );

  return txStreamResult;
}
