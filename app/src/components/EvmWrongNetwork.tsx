import React from 'react';
import styled from 'styled-components';
import { Modal } from '@material-ui/core';
import { useEvmWallet, useWeb3React } from '@libs/evm-wallet';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { UIElementProps } from '@libs/ui';
import { Chain } from '@anchor-protocol/app-provider';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { ChainLogo } from './ChainLogo';

interface EvmWrongNetworkProps extends UIElementProps {
  chain: Chain;
  chainId: number;
}

const EvmWrongNetworkBase = (props: EvmWrongNetworkProps) => {
  const { className, chain, chainId } = props;

  const { disconnect } = useWeb3React();

  const { activate } = useEvmWallet();

  const onConnectWallet = async () => {
    const error = await activate(chainId);

    // an error means we have not connected, could probably try
    // being more specific and looking for the error code
    if (error !== undefined) {
      disconnect();
    }
  };

  return (
    <Modal open disableBackdropClick disableEnforceFocus>
      <Dialog className={className}>
        <ChainLogo className="anchor-logo" />
        <h3 className="title">Please connect to the {chain} network.</h3>

        <ActionButton className="primary" onClick={onConnectWallet}>
          Connect wallet
        </ActionButton>
        <hr />
        <p className="text">Alternatively you can disconnect and continue.</p>
        <ActionButton className="secondary" onClick={disconnect}>
          Disconnect
        </ActionButton>
      </Dialog>
    </Modal>
  );
};

export const EvmWrongNetwork = styled(EvmWrongNetworkBase)`
  background-color: white;

  .dialog-content {
    display: flex;
    flex-direction: column;
  }

  .anchor-logo {
    width: 44px;
    height: 44px;
    align-self: center;
  }

  .title {
    margin: 1rem 0 1rem;
  }

  .primary,
  .secondary {
    margin-top: 1em;
    color: ${({ theme }) => theme.textColor};
  }

  .primary,
  .secondary {
    background-color: ${({ theme }) =>
      theme.palette.type === 'light' ? '#f4f4f5' : '#2a2a46'};
  }

  .secondary {
    background-color: transparent;
    border-width: 2px;
    border-style: solid;
    border-color: ${({ theme }) =>
      theme.palette.type === 'light' ? '#f4f4f5' : '#2a2a46'};
  }

  hr {
    margin: 40px 0;
    border: 0;
    border-bottom: 1px dashed
      ${({ theme }) =>
        theme.palette.type === 'light'
          ? '#e5e5e5'
          : 'rgba(255, 255, 255, 0.1)'};
  }

  .text {
    text-align: center;
    margin-top: 1.5em;
    font-size: 11px;
    line-height: 1.5;
    color: ${({ theme }) => theme.dimTextColor};
  }
`;
