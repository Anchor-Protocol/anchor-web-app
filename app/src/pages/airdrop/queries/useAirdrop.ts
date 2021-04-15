import {
  bluna,
  ContractAddress,
  HumanAddr,
  Rate,
  uANC,
  WASMContractResult,
} from '@anchor-protocol/types';
import { useConnectedWallet } from '@anchor-protocol/wallet-provider2';
import { ApolloClient, gql, useApolloClient } from '@apollo/client';
import { useSubscription } from '@terra-dev/broadcastable-operation';
import { createMap, map } from '@terra-dev/use-map';
import { useContractAddress } from 'base/contexts/contract';
import { parseResult } from 'base/queries/parseResult';
import { MappedApolloQueryResult } from 'base/queries/types';
import { useCallback, useEffect, useState } from 'react';

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

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const dummyData: Airdrop = {
  createdAt: '',
  id: 1,
  stage: 1,
  address: '',
  staked: '100000000' as uANC,
  total: '100000000' as uANC,
  rate: '0.1' as Rate,
  amount: '100000000' as uANC,
  proof: '',
  merkleRoot: '',
  claimable: true,
};

export interface RawData {
  isClaimed: WASMContractResult;
}

export interface Data {
  isClaimed: WASMContractResult<bluna.airdropRegistry.IsClaimedResponse>;
}

export const dataMap = createMap<RawData, Data>({
  isClaimed: (existing, { isClaimed }) => {
    return parseResult(existing.isClaimed, isClaimed.Result);
  },
});

export interface RawVariables {
  airdropContract: string;
  isClaimedQuery: string;
}

export interface Variables {
  airdropContract: string;
  isClaimedQuery: bluna.airdropRegistry.IsClaimed;
}

export function mapVariables({
  airdropContract,
  isClaimedQuery,
}: Variables): RawVariables {
  return {
    airdropContract,
    isClaimedQuery: JSON.stringify(isClaimedQuery),
  };
}

export const query = gql`
  query __isClaimed($airdropContract: String!, $isClaimedQuery: String!) {
    isClaimed: WasmContractsContractAddressStore(
      ContractAddress: $airdropContract
      QueryMsg: $isClaimedQuery
    ) {
      Result
    }
  }
`;

export function useAirdrop(): [Airdrop | 'in-progress' | null, () => void] {
  const connectedWallet = useConnectedWallet();

  const [airdrop, setAirdrop] = useState<Airdrop | null | 'in-progress'>(
    'in-progress',
  );

  const client = useApolloClient();

  const address = useContractAddress();

  const refetch = useCallback(() => {
    if (
      connectedWallet &&
      connectedWallet.network.chainID.startsWith('columbus')
    ) {
      // NOTE: temporary
      // get airdrop list from db first,
      // then do the contract check
      fetch(
        `https://airdrop.anchorprotocol.com/api/get?address=${connectedWallet.walletAddress}&chainId=${connectedWallet.network.chainID}`,
      )
        .then((res) => res.json())
        .then(async (airdrops: Airdrop[]) => {
          // parallel queries may result in mantle failure for now,
          // do a series query
          // TODO: make this check off-chain
          return airdrops.reduce(
            (t, airdrop) =>
              t.then(async (filtered) => {
                // cap filtered so that if any airdrop-eligible entry is found,
                // do not care about the rest (saving network cost)
                if (filtered.length > 0) return filtered;

                const { stage } = airdrop;
                const isClaimed = await queryIsClaimed(
                  client,
                  address,
                  connectedWallet.walletAddress,
                  stage,
                );

                return isClaimed.data.isClaimed &&
                  isClaimed.data.isClaimed.is_claimed
                  ? filtered // skip if already claimed
                  : [...filtered, airdrop]; // eligible if not yet claimed
              }),
            Promise.resolve([] as Airdrop[]),
          );
        })
        .then((airdrops: Airdrop[]) => {
          // const claimableAirdrops = airdrops.filter(
          //   ({ claimable }) => claimable,
          // );

          if (airdrops.length > 0) {
            setAirdrop(airdrops[0]);
          } else {
            setAirdrop(null);
          }
        })
        .catch((e) => {
          console.error(e);
          setAirdrop(null);
        });
    } else {
      setAirdrop(null);
    }
  }, [address, client, connectedWallet]);

  useSubscription((id, event) => {
    if (event === 'done') {
      refetch();
    }
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  return [airdrop, refetch];
}

export function queryIsClaimed(
  client: ApolloClient<any>,
  address: ContractAddress,
  walletAddress: HumanAddr,
  stage: number,
): Promise<MappedApolloQueryResult<RawData, Data>> {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: mapVariables({
        airdropContract: address.bluna.airdropRegistry,
        isClaimedQuery: {
          is_claimed: {
            stage: stage,
            address: walletAddress,
          },
        },
      }),
    })
    .then((result) => {
      return {
        ...result,
        data: map(result.data, dataMap),
      };
    });
}
