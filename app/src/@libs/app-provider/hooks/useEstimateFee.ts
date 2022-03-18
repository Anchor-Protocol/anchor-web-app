import { useNetwork } from '@anchor-protocol/app-provider';
import { Gas, HumanAddr } from '@libs/types';
import { Msg } from '@terra-money/terra.js';
import big from 'big.js';
import { useCallback } from 'react';
import { useApp } from '../contexts/app';

export interface EstimatedFee {
  gasWanted: Gas;
  txFee: Gas;
}

export function useEstimateFee(
  walletAddress: HumanAddr | undefined,
): (msgs: Msg[]) => Promise<EstimatedFee | undefined> {
  const { lcdClient } = useNetwork();
  const { gasPrice, constants } = useApp();

  return useCallback(
    async (msgs: Msg[]) => {
      if (!walletAddress) {
        return undefined;
      }

      try {
        const { auth_info } = await lcdClient.tx.create(
          [{ address: walletAddress }],
          {
            msgs,
            gasAdjustment: constants.gasAdjustment,
            //@ts-ignore
            gasPrices: gasPrice,
          },
        );
        const estimatedFeeGas = auth_info.fee.amount
          .toArray()
          .reduce((gas, coin) => {
            //@ts-ignore
            const price = gasPrice[coin.denom];
            return gas.plus(coin.amount.div(price).toString());
          }, big(0));

        return {
          gasWanted: auth_info.fee.gas_limit as Gas,
          txFee: Math.floor(estimatedFeeGas.toNumber()) as Gas,
        };
      } catch {
        return undefined;
      }
    },
    [constants.gasAdjustment, gasPrice, lcdClient.tx, walletAddress],
  );
}
