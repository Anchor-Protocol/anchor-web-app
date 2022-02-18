import React, { useMemo } from 'react';
import { VoidSigner } from '@ethersproject/abstract-signer';
import { UIElementProps } from '@libs/ui';
import { ContractsContext, Contracts } from 'contexts/evm/contracts';
import { useEvmWallet, EvmChainId } from '@libs/evm-wallet';
import {
  IERC20__factory,
  CrossAnchorBridge__factory,
} from '@libs/typechain-types';
import { getAddress } from 'configurations/evm/addresses';

const EvmContractsProvider = ({ children }: UIElementProps) => {
  const { chainId = EvmChainId.ETHEREUM_ROPSTEN, provider } = useEvmWallet();

  const contracts = useMemo<Contracts>(() => {
    const crossAnchorBridgeAddress = getAddress(chainId, 'crossAnchorBridge');
    const ustAddress = getAddress(chainId, 'UST');

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
