import { formatRate, truncate } from '@anchor-protocol/notation';
import { Rate } from '@anchor-protocol/types';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import big from 'big.js';
import { useNotification } from 'contexts/notification';
import { useCallback, useEffect, useRef } from 'react';
import { userLtvQuery } from './userLtv';

export interface LiquidationAlert {
  enabled: boolean;
  ratio: number;
}

export function useLiquidationAlert({ enabled, ratio }: LiquidationAlert) {
  const { mantleEndpoint, mantleFetch } = useTerraWebapp();
  const { contractAddress: address } = useAnchorWebapp();
  const connectedWallet = useConnectedWallet();
  const { permission, create } = useNotification();

  console.log('index.ts..useLiquidationAlert()', ratio);

  const jobCallback = useCallback(async () => {
    if (!connectedWallet || permission !== 'granted') {
      return;
    }

    try {
      const ltv = await userLtvQuery({
        walletAddress: connectedWallet.walletAddress,
        mantleFetch,
        mantleEndpoint,
        address,
      });

      if (big(ltv).gte(ratio)) {
        create('Anchor Borrow LTV Notification', {
          body: `[Alert] LTV ratio (${formatRate(
            ltv as Rate,
          )}%) is above the set threshold (${formatRate(
            ratio as Rate<number>,
          )}%) for ${truncate(connectedWallet.walletAddress)}`,
          icon: '/logo.png',
        });
      }
    } catch {}
  }, [
    address,
    connectedWallet,
    create,
    mantleEndpoint,
    mantleFetch,
    permission,
    ratio,
  ]);

  const jobCallbackRef = useRef(jobCallback);

  useEffect(() => {
    jobCallbackRef.current = jobCallback;
  }, [jobCallback]);

  useEffect(() => {
    if (connectedWallet && permission === 'granted' && enabled) {
      console.log('LIQUIDATION ALERT: ON');
      const intervalId = setInterval(() => {
        jobCallbackRef.current();
      }, 1000 * 30);

      jobCallbackRef.current();

      return () => {
        clearInterval(intervalId);
      };
    }
    console.log('LIQUIDATION ALERT: OFF');
  }, [connectedWallet, enabled, permission]);
}
