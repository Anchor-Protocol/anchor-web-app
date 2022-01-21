import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { useEvmWallet } from '@libs/web3';
import React, { useCallback, useState } from 'react';
import { ConnectionTypeList } from './ConnectionTypeList';
import { TermsMessage } from './TermsMessage';
import { WalletSelector } from './WalletSelector';
import { EvmWalletDetailContent } from '../wallet/EvmWalletDetailContent';

const EvmWalletConnectionList = ({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) => {
  const { actions, availableConnections } = useEvmWallet();

  return (
    <ConnectionTypeList footer={<TermsMessage />}>
      {availableConnections.map(({ icon, name, type }) => (
        <FlatButton
          key={type}
          className="connect"
          onClick={() => {
            actions.activate(type);
            setOpen(false);
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

const EvmWalletSelector = () => {
  const { actions, address, chainId, connection } = useEvmWallet();
  const [open, setOpen] = useState(false);
  const onClick = useCallback(() => setOpen((prev) => !prev), []);
  const onClose = useCallback(() => setOpen(false), []);

  const disconnectWallet = useCallback(() => {
    onClose();
    actions.deactivate();
  }, [actions, onClose]);

  return (
    <WalletSelector
      initializing={false}
      open={open}
      onClick={onClick}
      onClose={onClose}
    >
      {address && chainId && connection ? (
        <EvmWalletDetailContent
          chainId={chainId}
          connection={connection}
          disconnectWallet={disconnectWallet}
          walletAddress={address}
          // availablePost={}
          // bank={}
          // closePopup={() => setOpen(false)}
          // openBuyUst={}
          // openSend={}
        />
      ) : (
        <EvmWalletConnectionList setOpen={setOpen} />
      )}
    </WalletSelector>
  );
};

export { EvmWalletSelector };
