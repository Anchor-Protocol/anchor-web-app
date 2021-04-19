import { HumanAddr, uToken } from '@anchor-protocol/types';
import { useUserWallet } from '@anchor-protocol/wallet-provider';
import burnData from './transformed/burn.json';

export function useIsBurnUser(): { address: HumanAddr; amount: uToken } | null {
  const userWallet = useUserWallet();

  //@ts-ignore
  if (userWallet && burnData[userWallet.walletAddress]) {
    return {
      address: userWallet.walletAddress,
      //@ts-ignore
      amount: burnData[userWallet.walletAddress],
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
