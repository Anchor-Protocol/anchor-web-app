import { microfy } from '@anchor-protocol/notation';
import { bLuna, bluna, Luna, ubLuna } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function pegRecovery(
  amount: bLuna | Luna,
  exchangeRate: bluna.hub.StateResponse | undefined,
  parameters: bluna.hub.ParametersResponse | undefined,
): ubLuna<Big> | undefined {
  if (!exchangeRate || !parameters || amount.length === 0) {
    return undefined;
  }

  return big(exchangeRate.exchange_rate).lt(parameters.er_threshold)
    ? (big(parameters.peg_recovery_fee).mul(microfy(amount)) as ubLuna<Big>)
    : undefined;
}
