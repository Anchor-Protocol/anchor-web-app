import { ANC, HumanAddr, Rate, u } from '@anchor-protocol/types';
import { QueryClient } from '@libs/query-client';
import { airdropStageCache } from '../../caches/airdropStage';
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
  walletAddress: HumanAddr | undefined,
  airdropContract: HumanAddr,
  chainId: string,
  queryClient: QueryClient,
): Promise<Airdrop | undefined> {
  if (!walletAddress || !chainId.startsWith('columbus')) {
    return undefined;
  }

  // sleep for airdrop claim resolving
  await new Promise((resolve) => setTimeout(resolve, 1000 * 3));

  try {
    const airdrops: Airdrop[] = await fetch(
      `https://airdrop.anchorprotocol.com/api/get?address=${walletAddress}&chainId=columbus-4`,
    ).then((res) => res.json());

    if (airdrops.length === 0) {
      return undefined;
    }

    const claimedStages = airdropStageCache.get(walletAddress) ?? [];

    for (const airdrop of airdrops) {
      const { stage } = airdrop;

      const { isClaimed } = await airdropIsClaimedQuery(
        airdropContract,
        walletAddress,
        stage,
        queryClient,
      );

      // FIXME double check if the stage is not claimed
      if (!isClaimed.is_claimed && !claimedStages.includes(stage)) {
        return airdrop;
      }
    }

    return undefined;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
