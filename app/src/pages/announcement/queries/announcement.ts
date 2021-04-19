import { HumanAddr, uLuna } from '@anchor-protocol/types';
import { AccAddress } from '@terra-money/terra.js';
import { useEffect, useState } from 'react';

export interface AnnouncementUser {
  address: HumanAddr;
  minterAmount?: uLuna | null;
  burnAmount?: uLuna | null;
}

export async function getAnnouncementUser(
  address: HumanAddr | null,
): Promise<AnnouncementUser | null> {
  if (!address) return null;

  if (address === 'terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9') {
    return Promise.resolve({
      address,
      minterAmount: '1000000' as uLuna,
      burnAmount: '1000000' as uLuna,
    });
  }

  return fetch(`https://service.anchorprotocol.com/api/q?address=${address}`)
    .then((res) => res.json())
    .then(
      ({
        mint,
        burn,
      }: {
        mint?: uLuna | null;
        burn?: uLuna | null;
      } = {}) => {
        console.log('announcement.ts..()', { address, mint, burn });
        return mint || burn
          ? {
              address,
              minterAmount: mint,
              burnAmount: burn,
            }
          : null;
      },
    )
    .catch((error) => {
      console.error(error);
      return null;
    });
}

export function useAnnouncementUser(
  address: HumanAddr | null,
): AnnouncementUser | null {
  const [data, setData] = useState<AnnouncementUser | null>(null);

  useEffect(() => {
    if (address && AccAddress.validate(address)) {
      getAnnouncementUser(address).then(setData);
    } else {
      setData(null);
    }
  }, [address]);

  return data;
}
