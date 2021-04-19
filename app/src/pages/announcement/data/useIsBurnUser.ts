import { HumanAddr, uLuna } from '@anchor-protocol/types';
import { useUserWallet } from '@anchor-protocol/wallet-provider';
import _burnData from './transformed/burn.json';

const burnData: Record<HumanAddr, uLuna> = {
  ..._burnData,
  // append test data
  terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9: '1000000',
  terra1rdzvwwd7hjemjjq6fdkw6dwa2swdzdg3yu9tft: '1000000',
  terra125tns80nr0skn0d7swghxxqqdajwukpcr48edc: '1000000',
};

export function useIsBurnUser(): { address: HumanAddr; amount: uLuna } | null {
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
