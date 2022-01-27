import { Observable } from 'rxjs';
import { TxResultRendering } from '@libs/app-fns';
import { ConnectedWallet } from '@terra-money/use-wallet';
import {
  AnchorConstants,
  AnchorContractAddress,
} from '@anchor-protocol/app-provider';
import { QueryClient } from '@libs/query-client';

export type TxObservableFn<AnchorParams> = (
  params: AnchorParams,
) => Observable<TxResultRendering>;

export type TxObservableFnDependencies = {
  constants: AnchorConstants;
  connectedWallet: ConnectedWallet | undefined;
  contractAddress: AnchorContractAddress;
  queryClient: QueryClient;
  txErrorReporter?: (error: unknown) => string;
  refetchQueries: (key: string) => void;
};
