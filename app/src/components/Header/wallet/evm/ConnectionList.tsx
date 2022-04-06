import React from 'react';
import { useEvmWallet } from '@libs/evm-wallet';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { ConnectionTypeList } from 'components/Header/desktop/ConnectionTypeList';
import { TermsMessage } from 'components/Header/desktop/TermsMessage';
import { useWeb3React } from '@libs/evm-wallet';

interface ConnectionListProps {
  onClose: () => void;
}

const ConnectionList = (props: ConnectionListProps) => {
  const { onClose } = props;

  const { connect } = useWeb3React();
  const { availableConnections } = useEvmWallet();

  return (
    <ConnectionTypeList footer={<TermsMessage />}>
      {availableConnections.map(({ icon, name, type }) => (
        <FlatButton
          key={type}
          className="connect"
          onClick={() => {
            console.log('connect to', type);
            connect(type);
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
