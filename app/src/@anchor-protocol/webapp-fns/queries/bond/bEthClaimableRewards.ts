import { beth, HumanAddr } from '@anchor-protocol/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/mantle';

interface BondBEthClaimableRewardsWasmQuery {
  claimableReward: WasmQuery<
    beth.rewards.AccruedRewards,
    beth.rewards.AccruedRewardsResponse
  >;
}

export type BondBEthClaimableRewards =
  WasmQueryData<BondBEthClaimableRewardsWasmQuery>;

export async function bondBEthClaimableRewardsQuery(
  bEthRewardAddr: HumanAddr,
  walletAddr: HumanAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<BondBEthClaimableRewards> {
  return mantle<BondBEthClaimableRewardsWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?bond--beth-claimable-rewards`,
    mantleFetch,
    requestInit,
    variables: {},
    wasmQuery: {
      claimableReward: {
        contractAddress: bEthRewardAddr,
        query: {
          accrued_rewards: {
            address: walletAddr,
          },
        },
      },
    },
  });
}
