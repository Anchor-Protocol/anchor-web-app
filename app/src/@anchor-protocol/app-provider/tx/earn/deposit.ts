import { useStream } from '@rx-stream/react';
import { useAccount } from 'contexts/account';
import { AnchorDepositParams, useAnchorApi } from 'contexts/api';
import { useCallback } from 'react';

export function useEarnDepositTx() {
  const { connected } = useAccount();

  const { deposit } = useAnchorApi();

  const streamReturn = useStream(deposit);

  return connected ? streamReturn : [null, null];
}

export function useEarnDepositTx2() {
  const { connected } = useAccount();

  const { deposit } = useAnchorApi();

  const stream = useCallback(
    (params: AnchorDepositParams) => {
      return deposit(params);
    },
    [deposit],
  );

  const streamReturn = useStream(stream);

  return connected ? streamReturn : [null, null];
}
