import { ethers } from 'ethers';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Modal } from '@material-ui/core';
import {
  chainConfigurations,
  useEvmWallet,
  EvmChainId,
} from '@libs/evm-wallet';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { UIElementProps } from '@libs/ui';
import {
  Chain,
  DEPLOYMENT_TARGETS,
  DeploymentTarget,
  useDeploymentTarget,
} from '@anchor-protocol/app-provider';
import { FlatButton } from '../@libs/neumorphism-ui/components/FlatButton';
import { ButtonList } from './Header/shared';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';

function EvmWrongNetworkBase({ className }: UIElementProps) {
  const { provider } = useEvmWallet();

  const { updateTarget } = useDeploymentTarget();

  const onClick = useCallback(
    (target: DeploymentTarget) => {
      if (target.isEVM && provider?.provider?.isMetaMask) {
        let targetChainId = EvmChainId.ETHEREUM;

        if (target.chain === Chain.Avalanche) {
          targetChainId = EvmChainId.AVALANCHE;
        }

        if (targetChainId && provider?.provider?.request) {
          provider.provider
            .request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: ethers.utils.hexValue(targetChainId) }],
            })
            .then(() => {
              updateTarget(target);
            })
            .catch(async (error: Error & { code: number }) => {
              if (error.code === 4902) {
                // 4902 = user attempting to switch to an unrecognized chainId in his wallet
                if (
                  chainConfigurations[targetChainId] &&
                  provider?.provider?.request
                ) {
                  provider.provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [chainConfigurations[targetChainId]],
                  });
                }
              }
            });

          return;
        }
      }

      updateTarget(target);
    },
    [provider, updateTarget],
  );

  return (
    <Modal open disableBackdropClick disableEnforceFocus>
      <Dialog className={className}>
        <h3>You're connected to the wrong network.</h3>
        <ButtonList title="Switch network">
          {DEPLOYMENT_TARGETS.map((target) => (
            <FlatButton
              key={target.chain}
              className="button"
              onClick={() => onClick(target)}
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
