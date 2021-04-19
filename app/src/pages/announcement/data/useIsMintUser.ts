import { HumanAddr, uToken } from '@anchor-protocol/types';
import { useUserWallet } from '@anchor-protocol/wallet-provider';
import mintData from './transformed/mint.json';

export function useIsMintUser(): { address: HumanAddr; amount: uToken } | null {
  const userWallet = useUserWallet();

  //@ts-ignore
  if (userWallet && mintData[userWallet.walletAddress]) {
    return {
      address: userWallet.walletAddress,
      //@ts-ignore
      amount: mintData[userWallet.walletAddress],
    };
  }

  if (
    userWallet?.walletAddress === 'terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9'
  ) {
    return {
      address: userWallet.walletAddress,
      amount: '100000' as uToken,
    };
  }

  return null;
}
