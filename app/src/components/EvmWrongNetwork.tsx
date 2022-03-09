import { ethers } from 'ethers';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Modal } from '@material-ui/core';
import {
  chainConfigurations,
  supportedChainIds,
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

function EvmWrongNetworkBase({ className }: UIElementProps) {
  const { chainId, provider } = useEvmWallet();
  const isSupportedChain = chainId ? supportedChainIds.includes(chainId) : true;

  const { updateTarget } = useDeploymentTarget();

  const onClick = useCallback(
    (target: DeploymentTarget) => {
      if (target.isEVM && provider?.provider?.isMetaMask) {
        let targetChainId = EvmChainId.ETHEREUM_ROPSTEN;

        if (target.chain === Chain.Avalanche) {
          targetChainId = EvmChainId.AVALANCHE_FUJI_TESTNET;
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

  return isSupportedChain ? null : (
    <Modal className={className} open disableBackdropClick disableEnforceFocus>
      <Dialog>
        <h3>You’re connected to the wrong network.</h3>
        <div className="title">Switch to Network:</div>
        <div className="buttons">
          {DEPLOYMENT_TARGETS.map((target) => (
            <FlatButton
              key={target.chain}
              className="button"
              onClick={() => onClick(target)}
            >
              {target.chain}
            </FlatButton>
          ))}
        </div>
      </Dialog>
    </Modal>
  );
}

export const EvmWrongNetwork = styled(EvmWrongNetworkBase)`
  .title {
    margin: 2rem 0 1rem;
  }

  .buttons {
    display: flex;
    flex-direction: column;
  }

  .button {
    width: 100%;
    height: 32px;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 8px;
  }
`;
