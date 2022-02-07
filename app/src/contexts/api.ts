import { aUST, u, UST } from '@anchor-protocol/types';
import { TxResultRendering } from '@libs/app-fns';
import { createContext, useContext } from 'react';
import { Observable } from 'rxjs';

export interface AnchorDepositParams {
  depositAmount: UST;
  txFee: u<UST>;
  onTxSucceed?: () => void;
}

export interface AnchorWithdrawParams {
  withdrawAmount: aUST;
  txFee: u<UST>;
  onTxSucceed?: () => void;
}

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
