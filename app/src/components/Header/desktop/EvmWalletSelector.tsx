import { useTerraWalletAddress } from '@anchor-protocol/app-provider';
import React, { useCallback, useState } from 'react';
import { ConnectionTypeList } from './ConnectionTypeList';
import { TermsMessage } from './TermsMessage';
import { WalletSelector } from './WalletSelector';

const EvmWalletConnectionList = () => {
  return <ConnectionTypeList footer={<TermsMessage />}><span /></ConnectionTypeList>;
};

const EvmWalletSelector = () => {
  const walletAddress = useTerraWalletAddress();

  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <WalletSelector
      initializing={false}
      open={open}
      onClick={onClick}
      onClose={onClose}
    >
      {walletAddress ? <EvmWalletConnectionList /> : <div></div>}
    </WalletSelector>
  );
};

export { EvmWalletSelector };
