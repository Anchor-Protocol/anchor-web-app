import { useAccount } from 'contexts/account';
import React, { useCallback, useState } from 'react';
import { ConnectionTypeList } from './ConnectionTypeList';
import { TermsMessage } from './TermsMessage';
import { WalletSelector } from './WalletSelector';

const EvmWalletConnectionList = () => {
  return <ConnectionTypeList footer={<TermsMessage />}><span /></ConnectionTypeList>;
};

const EvmWalletSelector = () => {
  const { nativeWalletAddress } = useAccount();

  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <WalletSelector
      walletAddress={nativeWalletAddress}
      initializing={false}
      onClick={onClick}
      onClose={onClose}
    >
      {nativeWalletAddress ? <EvmWalletConnectionList /> : <div></div>}
    </WalletSelector>
  );
};

export { EvmWalletSelector };
