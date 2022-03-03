import { useEvmWallet } from '@libs/evm-wallet';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEffect, useState } from 'react';

export const useEvmTerraAddress = () => {
  const { address } = useEvmWallet();
  const [terraAddress, setTerraAddress] = useState<string>();

  const xAnchor = useEvmCrossAnchorSdk();

  useEffect(() => {
    if (!address) {
      return;
    }
    xAnchor
      .terraAddress(address)
      .then((addr) => {
        setTerraAddress(addr);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [xAnchor, address]);

  return terraAddress;
};
