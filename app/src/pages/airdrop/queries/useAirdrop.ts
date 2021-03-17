import {
  bluna,
  ContractAddress,
  HumanAddr,
  Rate,
  uANC,
  WASMContractResult,
} from '@anchor-protocol/types';
import { ApolloClient, gql, useApolloClient } from '@apollo/client';
import { useSubscription } from '@terra-dev/broadcastable-operation';
import { createMap, map } from '@terra-dev/use-map';
import { useContractAddress } from 'base/contexts/contract';
import { useService } from 'base/contexts/service';
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
  const { walletReady } = useService();

  const [airdrop, setAirdrop] = useState<Airdrop | null | 'in-progress'>(
    'in-progress',
  );

  const client = useApolloClient();

  const address = useContractAddress();

  const refetch = useCallback(() => {
    if (walletReady && walletReady.network.chainID.startsWith('columbus')) {
      queryIsClaimed(client, address, walletReady.walletAddress)
        .then(({ data: { isClaimed } }) => {
          if (isClaimed && !isClaimed.is_claimed) {
            fetch(
              `https://airdrop.anchorprotocol.com/api/get?address=${walletReady.walletAddress}&chainId=${walletReady.network.chainID}`,
            )
              .then((res) => res.json())
              .then((airdrops: Airdrop[]) => {
                console.log(airdrops);
                const claimableAirdrops = airdrops.filter(
                  ({ claimable }) => claimable,
                );

                if (claimableAirdrops.length > 0) {
                  setAirdrop(claimableAirdrops[0]);
                } else {
                  setAirdrop(null);
                }
              });
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
  }, [address, client, walletReady]);

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
): Promise<MappedApolloQueryResult<RawData, Data>> {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: mapVariables({
        airdropContract: address.bluna.airdropRegistry,
        isClaimedQuery: {
          is_claimed: {
            stage: 1,
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
