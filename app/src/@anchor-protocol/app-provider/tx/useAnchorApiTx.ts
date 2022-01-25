import { TxResultRendering } from '@libs/app-fns';
import { StreamReturn, useStream } from '@rx-stream/react';
import { useAccount } from 'contexts/account';
import { AnchorApi, useAnchorApi } from 'contexts/api';
import { Observable } from 'rxjs';

type TxRenderingFn<TParams> = (
  params: TParams,
) => Observable<TxResultRendering>;

export function useAnchorApiTx<TParams>(
  selector: (api: AnchorApi) => TxRenderingFn<TParams>,
): StreamReturn<TParams, TxResultRendering> | [null, null] {
  const { connected } = useAccount();

  const api = useAnchorApi();

  const streamReturn = useStream(selector(api));

  return connected ? streamReturn : [null, null];
}
