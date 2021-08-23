import { bLuna, bluna, Luna, u } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import big, { Big } from 'big.js';

export function pegRecovery(
  exchangeRate: bluna.hub.StateResponse | undefined,
  parameters: bluna.hub.ParametersResponse | undefined,
): ((amount: bLuna | Luna) => u<bLuna<Big>>) | undefined {
  if (!exchangeRate || !parameters) {
    return undefined;
  }

  return big(exchangeRate.exchange_rate).lt(parameters.er_threshold)
    ? (amount: bLuna | Luna) =>
        big(parameters.peg_recovery_fee).mul(microfy(amount)) as u<bLuna<Big>>
    : undefined;
}
