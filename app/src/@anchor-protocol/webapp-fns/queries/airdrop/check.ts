import { ANC, HumanAddr, Rate, u } from '@anchor-protocol/types';
import { airdropStageCache } from '@anchor-protocol/webapp-fns/caches/airdropStage';
import { MantleFetch } from '@libs/webapp-fns';
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

export interface AirdropCheckVariables {
  airdropContract: HumanAddr;
  walletAddress: HumanAddr;
  chainId: string;
}

export interface AirdropCheckQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: AirdropCheckVariables;
}

export async function airdropCheckQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: AirdropCheckQueryParams): Promise<Airdrop | undefined> {
  if (!variables.chainId.startsWith('columbus')) {
    return undefined;
  }

  // sleep for airdrop claim resolving
  await new Promise((resolve) => setTimeout(resolve, 1000 * 3));

  try {
    console.log('FETCH AIRDROP DATA');

    const airdrops: Airdrop[] = await fetch(
      `https://airdrop.anchorprotocol.com/api/get?address=${variables.walletAddress}&chainId=${variables.chainId}`,
    ).then((res) => res.json());

    console.log('AIRDROPS:', JSON.stringify(airdrops, null, 2));

    if (airdrops.length === 0) {
      return undefined;
    }

    const claimedStages = airdropStageCache.get(variables.walletAddress) ?? [];

    for (const airdrop of airdrops) {
      const { stage } = airdrop;

      const { isClaimed } = await airdropIsClaimedQuery({
        mantleEndpoint,
        mantleFetch,
        wasmQuery: {
          isClaimed: {
            contractAddress: variables.airdropContract,
            query: {
              is_claimed: {
                address: variables.walletAddress,
                stage,
              },
            },
          },
        },
      });

      // FIXME double check if the stage is not claimed
      if (!isClaimed.is_claimed && !claimedStages.includes(stage)) {
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
