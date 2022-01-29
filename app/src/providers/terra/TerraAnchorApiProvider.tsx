import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { AnchorApiContext, AnchorDepositParams } from 'contexts/api';
import { useAccount } from 'contexts/account';
import { Observable } from 'rxjs';
import { TxResultRendering } from '@libs/app-fns';
import { earnDepositTx } from '@anchor-protocol/app-fns';
import { ConnectedWallet, useConnectedWallet } from '@terra-money/use-wallet';
import {
  AnchorConstants,
  ANCHOR_TX_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { useRefetchQueries } from '@libs/app-provider';
import { AddressProvider, MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { QueryClient } from '@libs/query-client';

type TxObservableFn<AnchorParams> = (
  params: AnchorParams,
) => Observable<TxResultRendering>;

type TxObservableFnDependencies = {
  constants: AnchorConstants;
  connectedWallet: ConnectedWallet | undefined;
  addressProvider: AddressProvider;
  queryClient: QueryClient;
  txErrorReporter?: (error: unknown) => string;
  refetchQueries: (key: string) => void;
};

const createDepositApi = (
  dependencies: TxObservableFnDependencies,
): TxObservableFn<AnchorDepositParams> => {
  const {
    constants,
    connectedWallet,
    addressProvider,
    queryClient,
    txErrorReporter,
    refetchQueries,
  } = dependencies;
  return (params: AnchorDepositParams) => {
    const { availablePost, connected, terraWalletAddress } = useAccount();

    if (!availablePost || !connected || !connectedWallet) {
      throw new Error('Can not post!');
    }
    const { depositAmount, txFee, onTxSucceed } = params;
    return earnDepositTx({
      address: terraWalletAddress,
      market: MARKET_DENOMS.UUSD,
      amount: depositAmount,
      network: connectedWallet.network,
      post: connectedWallet.post,
      txFee,
      gasFee: constants.gasWanted,
      gasAdjustment: constants.gasAdjustment,
      addressProvider,
      queryClient,
      txErrorReporter,
      onTxSucceed: () => {
        onTxSucceed?.();
        refetchQueries(ANCHOR_TX_KEY.EARN_DEPOSIT);
      },
    });
  };
};

const TerraAnchorApiProvider = ({ children }: UIElementProps) => {
  const connectedWallet = useConnectedWallet();

  const { addressProvider, constants, txErrorReporter, queryClient } =
    useAnchorWebapp();

  const refetchQueries = useRefetchQueries();

  const api = useMemo(() => {
    const dependencies = {
      connectedWallet,
      addressProvider,
      constants,
      queryClient,
      txErrorReporter,
      refetchQueries,
    };
    return {
      deposit: createDepositApi(dependencies),
    };
  }, [
    connectedWallet,
    addressProvider,
    constants,
    txErrorReporter,
    queryClient,
    refetchQueries,
  ]);

  return (
    <AnchorApiContext.Provider value={api}>
      {children}
    </AnchorApiContext.Provider>
  );
};

export { TerraAnchorApiProvider };
