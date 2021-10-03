import { Rate } from '@anchor-protocol/types';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { formatRate } from '@libs/formatter';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
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
  const connectedWallet = useConnectedWallet();
  const { permission, create } = useNotification();

  const history = useHistory();

  const jobCallback = useCallback(async () => {
    if (!connectedWallet || permission !== 'granted') {
      return;
    }

    try {
      const ltv = await userLtvQuery({
        walletAddress: connectedWallet.walletAddress,
        address,
        hiveQueryClient,
      });

      if (ltv && big(ltv).gte(ratio)) {
        const noti = create(`LTV is ${formatRate(ltv as Rate)}%`, {
          body: `Lower borrow LTV on Anchor webapp to prevent liquidation.`,
          icon: '/logo.png',
        });

        if (noti) {
          const click = () => {
            history.push('/borrow');
          };

          noti.addEventListener('click', click);

          setTimeout(() => {
            noti.removeEventListener('click', click);
          }, 1000 * 10);
        }
      }
    } catch {}
  }, [
    address,
    connectedWallet,
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
    if (connectedWallet && permission === 'granted' && enabled) {
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
  }, [connectedWallet, enabled, permission]);
}
