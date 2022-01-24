import { Observable } from 'rxjs';
import { TxResultRendering } from '@libs/app-fns';
import { ConnectedWallet } from '@terra-money/use-wallet';
import { AnchorConstants } from '@anchor-protocol/app-provider';
import { AddressProvider } from '@anchor-protocol/anchor.js';
import { QueryClient } from '@libs/query-client';

export type TxObservableFn<AnchorParams> = (
  params: AnchorParams,
) => Observable<TxResultRendering>;

export type TxObservableFnDependencies = {
  constants: AnchorConstants;
  connectedWallet: ConnectedWallet | undefined;
  addressProvider: AddressProvider;
  queryClient: QueryClient;
  txErrorReporter?: (error: unknown) => string;
  refetchQueries: (key: string) => void;
};
