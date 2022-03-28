import React, { useEffect, useState } from 'react';
import { UIElementProps } from '@libs/ui';
import { ClickAwayListener } from '@material-ui/core';
import styled from 'styled-components';
import { ChainButton } from './ChainButton';
import { DropdownBox, DropdownContainer } from '../desktop/DropdownContainer';
import { ChainList } from './ChainList';
import { useEvmWallet, useSwitchNetwork } from '@libs/evm-wallet';
import {
  Chain,
  DEPLOYMENT_TARGETS,
  useDeploymentTarget,
} from '@anchor-protocol/app-provider';
import { EvmChainId } from '@anchor-protocol/crossanchor-sdk';

const evmDeploymentTarget = (chain: Chain) => {
  return DEPLOYMENT_TARGETS.filter((t) => t.chain === chain)[0];
};

const evmChain = (chainId: EvmChainId) => {
  switch (chainId) {
    case EvmChainId.AVALANCHE:
    case EvmChainId.AVALANCHE_FUJI_TESTNET:
      return Chain.Avalanche;
    default:
      return Chain.Ethereum;
  }
};

const ChainSelectorBase = (props: UIElementProps) => {
  const { className } = props;

  // TODO: structure reactive chain switching logic properly (metamask chain switch)
  const [open, setOpen] = useState(false);
  const switchNetwork = useSwitchNetwork();
  const { target } = useDeploymentTarget();
  const { provider, chainId } = useEvmWallet();

  useEffect(() => {
    if (target.isEVM && provider?.provider?.isMetaMask && chainId) {
      const evmTarget = evmDeploymentTarget(evmChain(chainId));

      switchNetwork({ ...evmTarget, evmChainId: chainId });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={className}>
        <ChainButton onClick={() => setOpen((v) => !v)} />
        {open && (
          <DropdownContainer>
            <DropdownBox>
              <ChainList onClose={() => setOpen((v) => !v)} />
            </DropdownBox>
          </DropdownContainer>
        )}
      </div>
    </ClickAwayListener>
  );
};

export const ChainSelector = styled(ChainSelectorBase)`
  display: inline-block;
  position: relative;
  text-align: left;
`;
