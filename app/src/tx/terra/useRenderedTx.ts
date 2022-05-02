import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { _catchTxError } from '@libs/app-fns/tx/internal';
import { StreamReturn, useStream } from '@rx-stream/react';
import { TxInfo } from '@terra-money/terra.js';
import { NetworkInfo } from '@terra-money/use-wallet';
import { useCallback, useMemo } from 'react';
import { BehaviorSubject, from, merge, mergeMap } from 'rxjs';
import { TerraTxProgressWriter } from './TerraTxProgressWriter';
import { useTxTimer } from './useTxTimer';

export function useRenderedTx<TxParams>($: {
  sendTx: (params: TxParams, writer: TerraTxProgressWriter) => Promise<TxInfo>;
  renderResults: (
    txInfo: TxInfo,
    writer: TerraTxProgressWriter,
    params: TxParams,
  ) => Promise<TxResultRendering>;
  network: NetworkInfo;
  txFee: string;
  message?: string;
  txErrorReporter?: (error: unknown) => string;
}): StreamReturn<TxParams, TxResultRendering> | null[] {
  const subject = useMemo(
    () =>
      new BehaviorSubject<TxResultRendering>({
        value: null,
        phase: TxStreamPhase.BROADCAST,
        receipts: [],
      }),
    [],
  );

  const writer = useMemo(
    () => new TerraTxProgressWriter(subject, $.network, $.txFee),
    [$.network, $.txFee, subject],
  );

  const send = useCallback(
    async (params: TxParams, writer: TerraTxProgressWriter) => {
      const result = await $.sendTx(params, writer);
      writer.writeTxHash(result.txhash);
      return result;
    },
    [$],
  );

  const withTimer = useTxTimer(send, $.message ?? 'Default message');

  const txCallback = useCallback(
    (params: TxParams) =>
      merge(
        subject,
        from(withTimer(params, writer)).pipe(
          mergeMap((txInfo) => $.renderResults(txInfo, writer, params)),
        ),
      ).pipe(_catchTxError({ helper: writer, ...$ })),
    [$, writer, subject, withTimer],
  );

  const [fetch, result] = useStream(txCallback);
  const txStreamResult = useMemo(
    () => [fetch, result] as StreamReturn<TxParams, TxResultRendering>,
    [fetch, result],
  );

  return txStreamResult;
}
