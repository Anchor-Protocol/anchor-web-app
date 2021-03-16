import { Rate, uANC } from '@anchor-protocol/types';
import { useService } from 'base/contexts/service';
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

export function useAirdrop(): [Airdrop | null, () => void] {
  const { walletReady } = useService();
  const [airdrop, setAirdrop] = useState<Airdrop | null>(null);

  const refetch = useCallback(() => {
    if (walletReady && walletReady.network.chainID.startsWith('columbus')) {
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
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [walletReady]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return [airdrop, refetch];
}
