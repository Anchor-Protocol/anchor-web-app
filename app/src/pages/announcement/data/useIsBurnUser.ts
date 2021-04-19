import { HumanAddr, uToken } from '@anchor-protocol/types';
import { useUserWallet } from '@anchor-protocol/wallet-provider';
import _burnData from './transformed/burn.json';

const burnData: Record<HumanAddr, uToken> = {
  ..._burnData,
  // append test data
  terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9: '1000000',
};

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

  return null;
}
