import { ANC } from '@anchor-protocol/types';
import { u } from '@libs/types';
import { BigSource } from 'big.js';
import { useGovStakerQuery } from 'queries/gov/useGovStakerQuery';

export const useMyAncStaked = (): u<ANC<BigSource>> | undefined => {
  const { data: staker } = useGovStakerQuery();

  return staker?.balance;
};
