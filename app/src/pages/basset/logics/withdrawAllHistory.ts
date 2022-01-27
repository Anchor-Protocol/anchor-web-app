import type { bLuna, Luna, u } from '@anchor-protocol/types';
import { bluna } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export interface WithdrawHistory {
  blunaAmount: u<bLuna<Big>>;
  lunaAmount?: u<Luna<Big>>;
  requestTime?: Date;
  claimableTime?: Date;
}

export function withdrawAllHistory(
  unbondRequests: bluna.hub.UnbondRequestsResponse | undefined,
  unbondedRequestsStartFrom: number,
  allHistory: bluna.hub.AllHistoryResponse | undefined,
  parameters: bluna.hub.ParametersResponse | undefined,
): WithdrawHistory[] | undefined {
  if (
    !unbondRequests ||
    unbondedRequestsStartFrom < 0 ||
    !allHistory ||
    !parameters
  ) {
    return undefined;
  }

  return unbondRequests.requests.map<WithdrawHistory>(([index, amount]) => {
    const historyIndex: number = index - unbondedRequestsStartFrom;
    const matchingHistory = allHistory.history[historyIndex - 1];

    const blunaAmount = big(amount) as u<bLuna<Big>>;

    if (!matchingHistory) {
      return {
        blunaAmount,
      };
    }

    const { time, withdraw_rate } = matchingHistory;
    const { unbonding_period } = parameters;

    const lunaAmount = blunaAmount.mul(withdraw_rate) as u<Luna<Big>>;
    const requestTime = new Date(time * 1000);
    const claimableTime = new Date((time + unbonding_period) * 1000);

    return {
      blunaAmount,
      lunaAmount,
      requestTime,
      claimableTime,
    };
  });
}
