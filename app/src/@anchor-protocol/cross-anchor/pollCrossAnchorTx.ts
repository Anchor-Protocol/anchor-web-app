import { Observable, of } from 'rxjs';
import { pipe } from '@rx-stream/pipe';
import { TxResultRendering } from '@libs/app-fns';
import { CrossAnchorTx } from '.';
import { createObservable } from './createObservable';
import { pollWormholeSignedVAA } from './pollWormholeSignedVAA';
import { pollTerra } from './pollTerra';
import { formatEllapsed } from '@libs/formatter';

const injectPlaceholder = (source: TxResultRendering<CrossAnchorTx>) => {
  return of({
    ...source,
    receipts: [
      ...source.receipts,
      {
        name: '',
        value: formatEllapsed(0),
      },
    ],
  });
};

const removePlaceholder = (source: TxResultRendering<CrossAnchorTx>) => {
  return of({
    ...source,
    receipts: [...source.receipts.slice(0, source.receipts.length - 1)],
  });
};

export const pollCrossAnchorTx =
  () =>
  (
    source: TxResultRendering<CrossAnchorTx>,
  ): Observable<TxResultRendering<CrossAnchorTx>> => {
    // NOTE: this is a WIP, I'm not sure we want to get too techy with
    // the messages that we display to the users but for now this will
    // help with debugging

    const observable = pipe(
      injectPlaceholder,
      createObservable(pollWormholeSignedVAA, 'Bridging to Terra'),
      createObservable(pollTerra, 'Executing Anchor Transaction'),
      createObservable(pollWormholeSignedVAA, 'Bridging to Ethereum'),
      removePlaceholder,
    );

    return observable(source);
  };
