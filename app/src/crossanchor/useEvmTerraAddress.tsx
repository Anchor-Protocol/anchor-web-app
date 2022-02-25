import { EvmChainId, useEvmWallet } from '@libs/evm-wallet';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEffect, useState } from 'react';
import { isEvmTestnet } from 'utils/evm';

export const useEvmTerraAddress = () => {
  const {
    address,
    provider,
    chainId = EvmChainId.ETHEREUM_ROPSTEN,
  } = useEvmWallet();
  const [terraAddress, setTerraAddress] = useState<string>();
  const evmSdk = useEvmCrossAnchorSdk(
    isEvmTestnet(chainId) ? 'testnet' : 'mainnet',
    provider,
  );

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
