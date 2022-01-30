import React, { useCallback, useState } from 'react';
import { useEvmWallet } from '@libs/evm-wallet';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { useAccount } from 'contexts/account';
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
  const { nativeWalletAddress } = useAccount();
  const { actions, chainId, connection, status } = useEvmWallet();
  const [open, setOpen] = useState(false);
  const onClick = useCallback(() => setOpen((prev) => !prev), []);
  const onClose = useCallback(() => setOpen(false), []);

  const disconnectWallet = useCallback(() => {
    onClose();
    actions.deactivate();
  }, [actions, onClose]);

  return (
    <WalletSelector
      walletAddress={nativeWalletAddress}
      initializing={status === 'initialization'}
      open={open}
      onClick={onClick}
      onClose={onClose}
    >
      {chainId && connection && nativeWalletAddress ? (
        <EvmWalletDetailContent
          chainId={chainId}
          connection={connection}
          disconnectWallet={disconnectWallet}
          walletAddress={nativeWalletAddress}
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
