import { ANC, HumanAddr, Rate, u } from '@anchor-protocol/types';
import { defaultMantleFetch, MantleFetch } from '@libs/webapp-fns';
import { airdropIsClaimedQuery } from './isClaimed';

export interface Airdrop {
  createdAt: string; // date string
  id: number;
  stage: number;
  address: string;
  staked: u<ANC>;
  total: u<ANC>;
  rate: Rate;
  amount: u<ANC>;
  proof: string; // JsonString<Array<string>>
  merkleRoot: string;
  claimable: boolean;
}

export async function airdropCheckQuery(
  airdropContract: HumanAddr,
  walletAddress: HumanAddr,
  chainId: string,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<Airdrop | undefined> {
  if (!chainId.startsWith('columbus')) {
    return undefined;
  }

  // sleep for airdrop claim resolving
  await new Promise((resolve) => setTimeout(resolve, 1000 * 3));

  try {
    console.log('FETCH AIRDROP DATA');

    const airdrops: Airdrop[] = await fetch(
      `https://airdrop.anchorprotocol.com/api/get?address=${walletAddress}&chainId=${chainId}`,
    ).then((res) => res.json());

    console.log('AIRDROPS:', JSON.stringify(airdrops, null, 2));

    if (airdrops.length === 0) {
      return undefined;
    }

    for (const airdrop of airdrops) {
      const { stage } = airdrop;

      const { isClaimed } = await airdropIsClaimedQuery(
        airdropContract,
        walletAddress,
        stage,
        mantleEndpoint,
        mantleFetch,
        requestInit,
      );

      if (!isClaimed.is_claimed) {
        console.log('NEXT CLAIM AIRDROP:', JSON.stringify(airdrop));
        return airdrop;
      }
    }

    return undefined;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
