import { MaxUint256 } from '@ethersproject/constants';
import { useAccount } from 'contexts/account';
import { useContracts } from 'contexts/evm/contracts';
import { useEvmTxFlow } from '../useEvmTxFlow';

export function useApproveUstTx() {
  const { nativeWalletAddress } = useAccount();
  const { crossAnchorBridgeContract, ustContract } = useContracts();

  return useEvmTxFlow(() =>
    ustContract.approve(
      crossAnchorBridgeContract.address,
      MaxUint256.toString(),
      { from: nativeWalletAddress },
    ),
  );
}
