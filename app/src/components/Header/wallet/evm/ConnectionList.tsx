import React from 'react';
import { ConnectType, useEvmWallet } from '@libs/evm-wallet';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { ConnectionTypeList } from 'components/Header/desktop/ConnectionTypeList';
import { useWeb3React } from '@libs/evm-wallet';
import { Footer } from './Footer';

interface ConnectionListProps {
  onClose: () => void;
  onRequestReadOnlyWallet: () => void;
}

const ConnectionList = (props: ConnectionListProps) => {
  const { onClose, onRequestReadOnlyWallet } = props;

  const { connect } = useWeb3React();

  const { availableConnections, availableConnectTypes } = useEvmWallet();

  return (
    <ConnectionTypeList
      footer={
        <Footer
          onClose={onClose}
          onRequestReadOnlyWallet={onRequestReadOnlyWallet}
          includesReadonly={availableConnectTypes.includes(
            ConnectType.ReadOnly,
          )}
        />
      }
    >
      {availableConnections.map(({ icon, name, type }) => (
        <FlatButton
          key={type}
          className="connect"
          onClick={() => {
            onClose();
            const connector = connect(type);
            connector.activate();
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
