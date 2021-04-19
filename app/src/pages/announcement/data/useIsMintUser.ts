import { HumanAddr, uLuna } from '@anchor-protocol/types';
import { useUserWallet } from '@anchor-protocol/wallet-provider';
import _mintData from './transformed/mint.json';

const mintData: Record<HumanAddr, uLuna> = {
  ..._mintData,
  // append test data
  terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9: '1000000',
  terra1rdzvwwd7hjemjjq6fdkw6dwa2swdzdg3yu9tft: '1000000',
  terra1x7ted5g0g6ntyqdaqmjwtzcctvvrdju49vs8pl: '1000000',
};

export function useIsMintUser(): { address: HumanAddr; amount: uLuna } | null {
  const userWallet = useUserWallet();

  //@ts-ignore
  if (userWallet && mintData[userWallet.walletAddress]) {
    return {
      address: userWallet.walletAddress,
      //@ts-ignore
      amount: mintData[userWallet.walletAddress],
    };
  }

  return null;
}
