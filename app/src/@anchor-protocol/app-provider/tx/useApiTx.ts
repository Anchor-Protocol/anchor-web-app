import { useStream } from '@rx-stream/react';
import { useAccount } from 'contexts/account';
import { useAnchorApi } from 'contexts/api';

export function useApiTx() {
  const { connected } = useAccount();

  const { deposit } = useAnchorApi();

  const streamReturn = useStream(deposit);

  return connected ? streamReturn : [null, null];
}
