import { StreamReturn } from '@rx-stream/react';
import { useEthCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { useTx } from './useTx';
import { renderEvent, toWei } from './utils';

export interface WithdrawUstTxProps {
  withdrawAmount: string;
}

export function useWithdrawUstTx():
  | StreamReturn<WithdrawUstTxProps, TxResultRendering>
  | [null, null] {
  const { provider, address, connection, connectType } = useEvmWallet();
  const ethSdk = useEthCrossAnchorSdk('testnet', provider);

  const result = useTx<WithdrawUstTxProps>((params, eventStream) => {
    return ethSdk.redeemStable(
      ethSdk.ustContract.address,
      toWei(params.withdrawAmount),
      address!,
      2100000,
      (event) => {
        console.log(event, 'eventEmitted');

        eventStream.next(renderEvent(event, connectType));
      },
    );
  });

  return connection && address ? result : [null, null];
}
