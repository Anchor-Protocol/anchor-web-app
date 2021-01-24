import { ubLuna, uLuna } from '@anchor-protocol/notation';
import big, { Big } from 'big.js';
import { useMemo } from 'react';
import { Data as Withdrawable } from '../queries/withdrawable';
import { Data as WithdrawAllHistory } from '../queries/withdrawHistory';

interface History {
  blunaAmount: ubLuna<Big>;
  lunaAmount?: uLuna<Big>;
  requestTime?: Date;
  claimableTime?: Date;
}

export function useWithdrawAllHistory(
  withdrawable: Withdrawable | undefined,
  withdrawAllHistory: WithdrawAllHistory | undefined,
): History[] | undefined {
  return useMemo<History[] | undefined>(() => {
    if (
      !withdrawable ||
      withdrawable.withdrawRequestsStartFrom < 0 ||
      !withdrawAllHistory
    ) {
      return undefined;
    }

    return withdrawable.withdrawRequests.requests.map<History>(
      ([index, amount]) => {
        const historyIndex: number =
          index - withdrawable.withdrawRequestsStartFrom;
        const matchingHistory =
          withdrawAllHistory.allHistory.history[historyIndex - 1];

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
            (matchingHistory.time +
              withdrawAllHistory.parameters.unbonding_period) *
              1000,
          ),
        };
      },
    );
  }, [withdrawAllHistory, withdrawable]);
}
