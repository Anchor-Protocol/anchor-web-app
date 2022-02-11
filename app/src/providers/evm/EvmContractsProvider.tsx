import React, { useMemo } from 'react';
import { VoidSigner } from '@ethersproject/abstract-signer';
import { UIElementProps } from '@libs/ui';
import { ContractsContext, Contracts } from 'contexts/evm/contracts';
import { useEvmWallet } from '@libs/evm-wallet';
import {
  IERC20__factory,
  CrossAnchorBridge__factory,
} from '@libs/evm-contracts';
import { getAddress } from 'configurations/addresses';

const EvmContractsProvider = ({ children }: UIElementProps) => {
  const { chainId, provider } = useEvmWallet();

  const contracts = useMemo<Contracts>(() => {
    const crossAnchorBridgeAddress = getAddress('crossAnchorBridge', chainId);
    const ustAddress = getAddress('ust', chainId);

    return {
      crossAnchorBridgeContract: CrossAnchorBridge__factory.connect(
        crossAnchorBridgeAddress,
        provider
          ? provider.getSigner()
          : new VoidSigner(crossAnchorBridgeAddress),
      ),
      ustContract: IERC20__factory.connect(
        ustAddress,
        provider ? provider.getSigner() : new VoidSigner(ustAddress),
      ),
    };
  }, [chainId, provider]);

  return (
    <ContractsContext.Provider value={contracts}>
      {children}
    </ContractsContext.Provider>
  );
};

export { EvmContractsProvider };
