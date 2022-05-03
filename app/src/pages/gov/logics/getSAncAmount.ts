import { u, ANC } from '@anchor-protocol/types';
import Big from 'big.js';

interface Params {
  amount: ANC;
  totalShare: u<ANC>;
  totalStaked: u<ANC>;
}

export const getSAncAmount = ({
  amount,
  totalShare,
  totalStaked,
}: Params): ANC =>
  Big(amount).mul(totalShare).div(totalStaked).toString() as ANC;
