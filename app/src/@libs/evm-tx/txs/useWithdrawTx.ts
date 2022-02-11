import { useAccount } from 'contexts/account';
import { useContracts } from 'contexts/evm/contracts';
import { EvmTxCommonProps } from '../types';
import { toWei } from '../utils';
import { useEvmTxFlow } from '../useEvmTxFlow';

export interface WithdrawTxProps extends EvmTxCommonProps {
  withdrawAmount: string;
}

export function useWithdrawTx() {
  const { nativeWalletAddress } = useAccount();
  const { crossAnchorBridgeContract, ustContract } = useContracts();

  return useEvmTxFlow<WithdrawTxProps>(({ withdrawAmount }) =>
    crossAnchorBridgeContract.redeemStable(
      ustContract.address,
      toWei(withdrawAmount),
      {
        from: nativeWalletAddress,
      },
    ),
  );
}
