import { useAccount } from 'contexts/account';
import { useContracts } from 'contexts/evm/contracts';
import { toWei } from '../utils';
import { useEvmTxFlow } from '../useEvmTxFlow';
import { EvmTxCommonProps } from '../types';

export interface DepositTxProps extends EvmTxCommonProps {
  depositAmount: string;
}

export function useDepositTx() {
  const { nativeWalletAddress } = useAccount();
  const { crossAnchorBridgeContract, ustContract } = useContracts();

  return useEvmTxFlow<DepositTxProps>(({ depositAmount }) =>
    crossAnchorBridgeContract.depositStable(
      ustContract.address,
      toWei(depositAmount),
      {
        from: nativeWalletAddress,
      },
    ),
  );
}
