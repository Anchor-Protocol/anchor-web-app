import React from 'react';
import styled from 'styled-components';
import { Modal } from '@material-ui/core';
import { useSwitchEvmNetwork, getDefaultEvmChainId } from '@libs/evm-wallet';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { UIElementProps } from '@libs/ui';
import {
  DEPLOYMENT_TARGETS,
  useDeploymentTarget,
} from '@anchor-protocol/app-provider';
import { FlatButton } from '../@libs/neumorphism-ui/components/FlatButton';
import { ButtonList } from './Header/shared';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';

function EvmWrongNetworkBase({ className }: UIElementProps) {
  const { updateTarget } = useDeploymentTarget();

  const switchEvmNetwork = useSwitchEvmNetwork();

  return (
    <Modal open disableBackdropClick disableEnforceFocus>
      <Dialog className={className}>
        <h3>You're connected to the wrong network.</h3>
        <ButtonList title="Switch network">
          {DEPLOYMENT_TARGETS.map((target) => (
            <FlatButton
              key={target.chain}
              className="button"
              onClick={() => {
                updateTarget(target);
                if (target.isEVM) {
                  switchEvmNetwork(getDefaultEvmChainId(target.chain));
                }
              }}
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

export const EvmWrongNetwork = styled(EvmWrongNetworkBase)`
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
