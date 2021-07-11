import { HumanAddr, Rate, uANC } from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';
import { airdropIsClaimedQuery } from './isClaimed';

export interface Airdrop {
  createdAt: string; // date string
  id: number;
  stage: number;
  address: string;
  staked: uANC;
  total: uANC;
  rate: Rate;
  amount: uANC;
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

  try {
    const airdrops: Airdrop[] = await fetch(
      `https://airdrop.anchorprotocol.com/api/get?address=${variables.walletAddress}&chainId=${variables.chainId}`,
    ).then((res) => res.json());

    if (airdrops.length === 0) {
      return undefined;
    }

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

      if (!isClaimed.is_claimed) {
        return airdrop;
      }
    }

    return undefined;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
