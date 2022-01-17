import { ConnectType } from '@terra-money/wallet-provider';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { useEvmWallet } from '@libs/web3-react';
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
  const { connector } = useEvmWallet();

  return (
    <ConnectionTypeList footer={<TermsMessage />}>
      <FlatButton
        className="connect"
        onClick={() => {
          connector.activate();
          setOpen(false);
        }}
      >
        <IconSpan>
          Metamask
          <img
            src={
              'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg'
            }
            alt="Metamask"
          />
        </IconSpan>
      </FlatButton>
    </ConnectionTypeList>
  );
};

const EvmWalletSelector = () => {
  const { address, chainId } = useEvmWallet();
  const [open, setOpen] = useState(false);
  const onClick = useCallback(() => setOpen((prev) => !prev), []);
  const onClose = useCallback(() => setOpen(false), []);

  const disconnectWallet = useCallback(() => {
    onClose();

    // if (connector) connector?.deactivate();
  }, [onClose]);

  return (
    <WalletSelector
      initializing={false}
      open={open}
      onClick={onClick}
      onClose={onClose}
    >
      {address && chainId ? (
        <EvmWalletDetailContent
          chainId={chainId}
          connection={{
            type: ConnectType.EXTENSION,
            name: 'Metamask',
            icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
          }}
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
