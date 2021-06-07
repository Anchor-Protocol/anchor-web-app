import { formatRate } from '@anchor-protocol/notation';
import { Rate } from '@anchor-protocol/types';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import big from 'big.js';
import { useNotification } from 'contexts/notification';
import { useCallback, useEffect, useRef } from 'react';
import { userLtvQuery } from './userLtv';

export function useLiquidationAlert() {
  const { mantleEndpoint, mantleFetch } = useTerraWebapp();
  const { contractAddress: address } = useAnchorWebapp();
  const connectedWallet = useConnectedWallet();
  const { permission, create } = useNotification();

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

      if (big(ltv).gte(0.45)) {
        create('Liquidation Alert!', {
          body: `Your Ltv is ${formatRate(ltv as Rate)}%`,
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
  ]);

  const jobCallbackRef = useRef(jobCallback);

  useEffect(() => {
    jobCallbackRef.current = jobCallback;
  }, [jobCallback]);

  useEffect(() => {
    if (connectedWallet && permission === 'granted') {
      const intervalId = setInterval(() => {
        jobCallbackRef.current();
      }, 1000 * 30);

      jobCallbackRef.current();

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [connectedWallet, permission]);
}
