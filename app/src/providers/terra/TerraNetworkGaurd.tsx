import React from 'react';
import { useNetwork } from '@anchor-protocol/app-provider';
import { UIElementProps } from '@libs/ui';
import { GlobalStyle } from 'components/GlobalStyle';
import { TerraUnsupportedNetwork } from './TerraUnsupportedNetwork';

export const TerraNetworkGuard = (props: UIElementProps) => {
  const { children } = props;

  const network = useNetwork();

  if (
    network?.network === undefined ||
    network.network.chainID !== 'columbus-5'
  ) {
    return (
      <>
        <GlobalStyle />
        <TerraUnsupportedNetwork />
      </>
    );
  }

  return <>{children}</>;
};
