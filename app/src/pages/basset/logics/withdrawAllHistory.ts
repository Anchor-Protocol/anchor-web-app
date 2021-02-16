import { ubLuna, uLuna } from '@anchor-protocol/notation';
import big, { Big } from 'big.js';
import { Data as WithdrawAllHistory } from '../queries/withdrawHistory';

interface History {
  blunaAmount: ubLuna<Big>;
  lunaAmount?: uLuna<Big>;
  requestTime?: Date;
  claimableTime?: Date;
}

export function withdrawAllHistory(
  withdrawRequestsStartFrom: number | undefined,
  requests: [number, ubLuna][] | undefined,
  allHistory: WithdrawAllHistory['allHistory'] | undefined,
  parameters: WithdrawAllHistory['parameters'] | undefined,
): History[] | undefined {
  if (
    typeof withdrawRequestsStartFrom !== 'number' ||
    withdrawRequestsStartFrom < 0 ||
    !requests ||
    !allHistory ||
    !parameters
  ) {
    return undefined;
  }

  return requests.map<History>(([index, amount]) => {
    const historyIndex: number = index - withdrawRequestsStartFrom;
    const matchingHistory = allHistory.history[historyIndex - 1];

    const blunaAmount = big(amount) as ubLuna<Big>;

    if (!matchingHistory) {
      return {
        blunaAmount,
      };
    }

    const { time, withdraw_rate } = matchingHistory;
    const { unbonding_period } = parameters;

    const lunaAmount = blunaAmount.mul(withdraw_rate) as uLuna<Big>;
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
