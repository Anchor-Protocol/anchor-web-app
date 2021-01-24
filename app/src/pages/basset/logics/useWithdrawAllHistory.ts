import { ubLuna, uLuna } from '@anchor-protocol/notation';
import big, { Big } from 'big.js';
import { useMemo } from 'react';
import { Data as WithdrawAllHistory } from '../queries/withdrawHistory';

interface History {
  blunaAmount: ubLuna<Big>;
  lunaAmount?: uLuna<Big>;
  requestTime?: Date;
  claimableTime?: Date;
}

export function useWithdrawAllHistory(
  withdrawRequestsStartFrom: number | undefined,
  requests: [number, ubLuna][] | undefined,
  allHistory: WithdrawAllHistory['allHistory'] | undefined,
  parameters: WithdrawAllHistory['parameters'] | undefined,
): History[] | undefined {
  return useMemo<History[] | undefined>(() => {
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

      return {
        blunaAmount,
        lunaAmount: blunaAmount.mul(
          matchingHistory.withdraw_rate,
        ) as uLuna<Big>,
        requestTime: new Date(matchingHistory.time * 1000),
        claimableTime: new Date(
          (matchingHistory.time + parameters.unbonding_period) * 1000,
        ),
      };
    });
  }, [allHistory, parameters, requests, withdrawRequestsStartFrom]);
}
