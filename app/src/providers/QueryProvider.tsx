import { useNetwork } from '@anchor-protocol/app-provider';
import { patchReactQueryFocusRefetching } from '@libs/patch-react-query-focus-refetching';
import { UIElementProps } from '@libs/ui';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

patchReactQueryFocusRefetching();

const queryClient = new QueryClient();

export const QueryProvider = ({ children }: UIElementProps) => {
  const { network } = useNetwork();

  useEffect(() => {
    queryClient.invalidateQueries();
  }, [network.chainID]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
