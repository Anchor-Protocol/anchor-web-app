import { UST } from '@anchor-protocol/types';
import { EarnDepositFormStates } from '@anchor-protocol/webapp-fns';

export interface EarnDepositFormReturn extends EarnDepositFormStates {
  updateDepositAmount: (depositAmount: UST) => void;
}

export function useEarnDepositForm(): EarnDepositFormReturn {
  //const connectedWallet = useConnectedWallet();
  //
  //const { contants } = useAnchorWebapp();

  //const [] = useState(() => {
  //  return new EarnDepositForm({
  //    isConnected: !!connectedWallet,
  //    fixedGas: contants.fixedGas,
  //    taxRate:
  //  })
  //})

  throw new Error('not implemented');
}
