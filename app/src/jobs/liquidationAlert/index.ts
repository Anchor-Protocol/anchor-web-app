import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rate } from '@anchor-protocol/types';
import { useAnchorWebapp } from '@anchor-protocol/app-provider';
import { formatRate } from '@libs/formatter';
import { useAccount } from 'contexts/account';
import big, { Big } from 'big.js';
import { useNotification } from 'contexts/notification';
import { userLtvQuery } from './userLtv';

export interface LiquidationAlert {
  enabled: boolean;
  ratio: number;
}

export function useLiquidationAlert({ enabled, ratio }: LiquidationAlert) {
  const { hiveQueryClient, contractAddress: address } = useAnchorWebapp();
  const { terraWalletAddress } = useAccount();
  const { permission, create } = useNotification();

  const navigate = useNavigate();

  const jobCallback = useCallback(async () => {
    if (!terraWalletAddress || permission !== 'granted') {
      return;
    }

    try {
      const ltv = await userLtvQuery({
        walletAddress: terraWalletAddress,
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
            navigate('/borrow');
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
    create,
    hiveQueryClient,
    permission,
    ratio,
    navigate,
    terraWalletAddress,
  ]);

  const jobCallbackRef = useRef(jobCallback);

  useEffect(() => {
    jobCallbackRef.current = jobCallback;
  }, [jobCallback]);

  useEffect(() => {
    if (terraWalletAddress && permission === 'granted' && enabled) {
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
  }, [enabled, permission, terraWalletAddress]);
}
