import React from 'react';
import { getDefaultEvmChainId, useEvmWallet } from '@libs/evm-wallet';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { ConnectionTypeList } from 'components/Header/desktop/ConnectionTypeList';
import { TermsMessage } from 'components/Header/desktop/TermsMessage';
import { useWeb3React } from '@libs/evm-wallet';
import { useDeploymentTarget } from '@anchor-protocol/app-provider';

interface ConnectionListProps {
  onClose: () => void;
}

const ConnectionList = (props: ConnectionListProps) => {
  const { onClose } = props;

  const {
    target: { chain },
  } = useDeploymentTarget();

  const { connect } = useWeb3React();
  const { availableConnections, chainId: evmChainId } = useEvmWallet();

  return (
    <ConnectionTypeList footer={<TermsMessage />}>
      {availableConnections.map(({ icon, name, type }) => (
        <FlatButton
          key={type}
          className="connect"
          onClick={() => {
            const connector = connect(type);
            if (evmChainId !== getDefaultEvmChainId(chain)) {
              connector.activate(getDefaultEvmChainId(chain));
            }
            onClose();
          }}
        >
          <IconSpan>
            {name}
            <img src={icon} alt={name} />
          </IconSpan>
        </FlatButton>
      ))}
    </ConnectionTypeList>
  );
};

export { ConnectionList };
