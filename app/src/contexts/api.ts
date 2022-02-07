import { aUST, u, UST } from '@anchor-protocol/types';
import { TxResultRendering } from '@libs/app-fns';
import { createContext, useContext } from 'react';
import { Observable } from 'rxjs';

interface AnchorOperationParams {
  txFee: u<UST>;
  onTxSucceed?: () => void;
}

export interface AnchorDepositParams extends AnchorOperationParams {
  depositAmount: UST;
}

export interface AnchorWithdrawParams extends AnchorOperationParams {
  withdrawAmount: aUST;
}

// export interface TerraSendTxParams extends AnchorOperationParams {
//   toWalletAddress: HumanAddr;
//   currency: { cw20Contract: CW20Addr } | { tokenDenom: string };
//   memo?: string;
//   amount: Token;
//   txFee: u<UST>;
//   onTxSucceed?: () => void;
// }

export interface AnchorApi {
  deposit: (params: AnchorDepositParams) => Observable<TxResultRendering>;
  withdraw: (params: AnchorWithdrawParams) => Observable<TxResultRendering>;
  approveDeposit?: (
    depositAmount: AnchorDepositParams['depositAmount'],
  ) => Observable<TxResultRendering>;
}

const AnchorApiContext = createContext<AnchorApi | undefined>(undefined);

const useAnchorApi = (): AnchorApi => {
  const context = useContext(AnchorApiContext);
  if (context === undefined) {
    throw new Error('The AnchorApiContext has not been defined.');
  }
  return context;
};

export { AnchorApiContext, useAnchorApi };
