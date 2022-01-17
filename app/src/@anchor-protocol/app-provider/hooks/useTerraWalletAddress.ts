import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { Chain, useDeploymentTarget } from '..';
import { HumanAddr } from '@libs/types';

const useTerraWalletAddress = (): HumanAddr | undefined => {
  const { isNative, chain } = useDeploymentTarget();

  // this is not a very elegant solution to have to call the Terra wallet provider
  // so we probably should have a separate <TerraWalletProvider> which has an
  // update method on it which can be called by the chain specific code
  const wallet = useWallet();

  if (isNative) {
    // we we are using the native terra chain then we simply
    // use the wallet address of the connected account
    return wallet.wallets?.length > 0 &&
      wallet?.status === WalletStatus.WALLET_CONNECTED
      ? (wallet.wallets[0].terraAddress as HumanAddr)
      : undefined;
  }

  // we are not using the native terra chain so we need to
  // map the source chain wallet to it's Terra wallet address
  switch (chain) {
    case Chain.Ethereum:
      // TODO: need to pull this from the contract query
      return 'terra1k529hl5nvrvavnzv4jm3um2lllxujrshpn5um2' as HumanAddr;
  }
};

export { useTerraWalletAddress };
