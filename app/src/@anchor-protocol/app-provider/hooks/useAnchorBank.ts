import { AnchorTax, AnchorTokenBalances } from '@anchor-protocol/app-fns';
import {
  ANC,
  AncUstLP,
  aUST,
  bEth,
  bLuna,
  bLunaLunaLP,
} from '@anchor-protocol/types';
import {
  useCW20Balance,
  useTerraNativeBalances,
  useUstTax,
} from '@libs/app-provider';
import { useConnectedWallet } from '@terra-money/use-wallet';
import { useMemo } from 'react';
import { useAnchorWebapp } from '../contexts/context';

export interface AnchorBank {
  tax: AnchorTax;
  tokenBalances: AnchorTokenBalances;
}

export function useAnchorBank(): AnchorBank {
  const { contractAddress } = useAnchorWebapp();

  const connectedWallet = useConnectedWallet();

  const { taxRate, maxTax } = useUstTax();

  const { uUST, uLuna } = useTerraNativeBalances(
    connectedWallet?.walletAddress,
  );

  const uANC = useCW20Balance<ANC>(
    contractAddress.cw20.ANC,
    connectedWallet?.walletAddress,
  );

  const uAncUstLP = useCW20Balance<AncUstLP>(
    contractAddress.cw20.AncUstLP,
    connectedWallet?.walletAddress,
  );

  const uaUST = useCW20Balance<aUST>(
    contractAddress.cw20.aUST,
    connectedWallet?.walletAddress,
  );

  const ubEth = useCW20Balance<bEth>(
    contractAddress.cw20.bEth,
    connectedWallet?.walletAddress,
  );

  const ubLuna = useCW20Balance<bLuna>(
    contractAddress.cw20.bLuna,
    connectedWallet?.walletAddress,
  );

  const ubLunaLunaLP = useCW20Balance<bLunaLunaLP>(
    contractAddress.cw20.bLunaLunaLP,
    connectedWallet?.walletAddress,
  );

  return useMemo(() => {
    return {
      tax: {
        taxRate,
        maxTaxUUSD: maxTax,
      },
      tokenBalances: {
        uUST,
        uANC,
        uAncUstLP,
        uaUST,
        ubEth,
        ubLuna,
        ubLunaLunaLP,
        uLuna,
      },
    };
  }, [
    maxTax,
    taxRate,
    uANC,
    uAncUstLP,
    uLuna,
    uUST,
    uaUST,
    ubEth,
    ubLuna,
    ubLunaLunaLP,
  ]);
}
