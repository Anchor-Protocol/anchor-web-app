import React from 'react';
import styled from 'styled-components';
import { Modal } from '@material-ui/core';
import {
  getDefaultEvmChainId,
  useEvmWallet,
  ConnectType,
  useWeb3React,
} from '@libs/evm-wallet';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { UIElementProps } from '@libs/ui';
import {
  DeploymentTarget,
  DEPLOYMENT_TARGETS,
  useDeploymentTarget,
} from '@anchor-protocol/app-provider';
import { FlatButton } from '../@libs/neumorphism-ui/components/FlatButton';
import { ButtonList } from './Header/shared';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';

function EvmUnsupportedNetworkBase({ className }: UIElementProps) {
  const { updateTarget } = useDeploymentTarget();

  const { disconnect } = useWeb3React();

  const { connectionType, activate } = useEvmWallet();

  const onSwitchChain = (target: DeploymentTarget) => {
    return async () => {
      if (target.isEVM === false || connectionType === ConnectType.None) {
        // if we arent connected to a wallet then just update the target
        updateTarget(target);
        return;
      }

      const { mainnet } = getDefaultEvmChainId(target.chain);

      // activate the connection first before updating the target
      const error = await activate(mainnet);

      if (error) {
        disconnect();
      }

      updateTarget(target);
    };
  };

  return (
    <Modal open disableBackdropClick disableEnforceFocus>
      <Dialog className={className}>
        <h3>You're connected to an unsupported network.</h3>
        <ButtonList title="Switch network">
          {DEPLOYMENT_TARGETS.map((target) => (
            <FlatButton
              key={target.chain}
              className="button"
              onClick={onSwitchChain(target)}
            >
              <IconSpan>
                {target.chain}
                <img src={target.icon} alt={target.chain} />
              </IconSpan>
            </FlatButton>
          ))}
        </ButtonList>
      </Dialog>
    </Modal>
  );
}

export const EvmUnsupportedNetwork = styled(EvmUnsupportedNetworkBase)`
  background-color: white;

  .title {
    margin: 2rem 0 1rem;
  }

  .button {
    background-color: ${({ theme }) =>
      theme.palette.type === 'light' ? '#f4f4f5' : '#2a2a46'};
    color: ${({ theme }) => theme.textColor};
  }
`;
