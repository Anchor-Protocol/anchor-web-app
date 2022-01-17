import { Rate } from '@anchor-protocol/types';
import {
  useAnchorWebapp,
  useTerraWalletAddress,
} from '@anchor-protocol/app-provider';
import { formatRate } from '@libs/formatter';
import big, { Big } from 'big.js';
import { useNotification } from 'contexts/notification';
import { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { userLtvQuery } from './userLtv';

export interface LiquidationAlert {
  enabled: boolean;
  ratio: number;
}

export function useLiquidationAlert({ enabled, ratio }: LiquidationAlert) {
  const { hiveQueryClient, contractAddress: address } = useAnchorWebapp();
  const walletAddress = useTerraWalletAddress();
  const { permission, create } = useNotification();

  const history = useHistory();

  const jobCallback = useCallback(async () => {
    if (!walletAddress || permission !== 'granted') {
      return;
    }

    try {
      const ltv = await userLtvQuery({
        walletAddress,
        address,
        hiveQueryClient,
      });

      if (ltv && big(ltv).gte(ratio)) {
        const notification = create(
          `Borrow Usage is ${formatRate(ltv as Rate<Big>)}%`,
          {
            body: `Lower borrow usage on Anchor webapp to prevent liquidation.`,
            icon: '/logo.png',
          },
        );

        if (notification) {
          const click = () => {
            history.push('/borrow');
          };

          notification.addEventListener('click', click);

          setTimeout(() => {
            notification.removeEventListener('click', click);
          }, 1000 * 10);
        }
      }
    } catch {}
  }, [
    address,
    walletAddress,
    create,
    history,
    hiveQueryClient,
    permission,
    ratio,
  ]);

  const jobCallbackRef = useRef(jobCallback);

  useEffect(() => {
    jobCallbackRef.current = jobCallback;
  }, [jobCallback]);

  useEffect(() => {
    if (walletAddress && permission === 'granted' && enabled) {
      //console.log('LIQUIDATION ALERT: ON');
      const intervalId = setInterval(() => {
        jobCallbackRef.current();
      }, 1000 * 60);

      jobCallbackRef.current();

      return () => {
        clearInterval(intervalId);
      };
    }
    //console.log('LIQUIDATION ALERT: OFF');
  }, [walletAddress, enabled, permission]);
}
