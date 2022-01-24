import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { AnchorApiContext } from 'contexts/api';
import { useConnectedWallet } from '@terra-money/use-wallet';
import { useAnchorWebapp } from '@anchor-protocol/app-provider';
import { useRefetchQueries } from '@libs/app-provider';
import { createDepositApi } from './api/createDepositApi';
import { createWithdrawApi } from './api/createWithdrawApi';

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
      withdraw: createWithdrawApi(dependencies),
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
