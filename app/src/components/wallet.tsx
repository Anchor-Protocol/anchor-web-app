import React from 'react';
import { useWallet } from '../hooks/use-wallet';
import { truncate } from '../libs/text';

interface WalletProps {}

const Wallet: React.FunctionComponent<WalletProps> = () => {
  const { address, connect, disconnect } = useWallet();
  const onClick = () => (address ? disconnect() : connect());

  return (
    <button onClick={onClick}>
      {address ? truncate(address) : 'connect wallet'}
    </button>
  );
};

export default Wallet;
