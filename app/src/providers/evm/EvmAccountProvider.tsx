import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { AccountContext, Account } from 'contexts/account';
import { HumanAddr } from '@libs/types';
import { EvmChainId, useEvmWallet } from '@libs/evm-wallet';
import { useEthCrossAnchorSdk } from 'crossanchor';
import { isEvmTestnet } from 'utils/evm';

const EvmAccountProvider = ({ children }: UIElementProps) => {
  const {
    address,
    provider,
    status,
    chainId = EvmChainId.ETHEREUM_ROPSTEN,
  } = useEvmWallet();

  const evmSdk = useEthCrossAnchorSdk(
    isEvmTestnet(chainId) ? 'testnet' : 'mainnet',
    provider,
  );
  console.log(evmSdk);

  const terraWalletAddress = useMemo<HumanAddr>(() => {
    // TODO
    //evmSdk.getTerraAddress(address);
    return 'terra1k529hl5nvrvavnzv4jm3um2lllxujrshpn5um2' as HumanAddr;
  }, []);

  const account = useMemo<Account>(() => {
    if (status !== 'connected' || terraWalletAddress === undefined) {
      return {
        status,
        connected: false,
        availablePost: false,
        network: 'evm',
        readonly: true,
      };
    }
    return {
      status,
      connected: true,
      availablePost: true,
      nativeWalletAddress: address as HumanAddr,
      network: 'evm',
      readonly: false,
      terraWalletAddress,
    };
  }, [address, status, terraWalletAddress]);

  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
};

export { EvmAccountProvider };
