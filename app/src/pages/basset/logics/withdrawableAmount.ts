import { uLuna } from '@anchor-protocol/notation';
import big, { Big } from 'big.js';

export function withdrawableAmount(
  withdrawable: uLuna | undefined,
): uLuna<Big> {
  return big(withdrawable ?? 0) as uLuna<Big>;
}
