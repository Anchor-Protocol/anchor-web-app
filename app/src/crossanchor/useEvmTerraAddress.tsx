import { useEvmWallet } from '@libs/evm-wallet';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEffect, useState } from 'react';

export const useEvmTerraAddress = () => {
  const { address } = useEvmWallet();
  const [terraAddress, setTerraAddress] = useState<string>();

  const evmSdk = useEvmCrossAnchorSdk();

  useEffect(() => {
    if (!address) {
      return;
    }

    evmSdk.terraAddress(address).then((addr) => {
      setTerraAddress(addr);
    });
  }, [evmSdk, address]);

  return terraAddress;
};
