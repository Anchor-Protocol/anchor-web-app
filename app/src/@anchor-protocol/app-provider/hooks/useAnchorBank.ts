import {
  AnchorTax,
  AnchorTokenBalances,
  DefaultAnchorTokenBalances,
} from '@anchor-protocol/app-fns';
import {
  ANC,
  AncUstLP,
  aUST,
  bLuna,
  bLunaLunaLP,
} from '@anchor-protocol/types';
import {
  useCW20Balance,
  useTerraNativeBalances,
  useUstTax,
} from '@libs/app-provider';
import { useMemo } from 'react';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../contexts/context';

export interface AnchorBank {
  tax: AnchorTax;
  tokenBalances: AnchorTokenBalances;
}

export function useAnchorBank(): AnchorBank {
  const { contractAddress } = useAnchorWebapp();

  const { terraWalletAddress } = useAccount();

  const { taxRate, maxTax } = useUstTax();

  const { uUST, uLuna } = useTerraNativeBalances(terraWalletAddress);

  const uANC = useCW20Balance<ANC>(
    contractAddress.cw20.ANC,
    terraWalletAddress,
  );

  const uAncUstLP = useCW20Balance<AncUstLP>(
    contractAddress.cw20.AncUstLP,
    terraWalletAddress,
  );

  const uaUST = useCW20Balance<aUST>(
    contractAddress.cw20.aUST,
    terraWalletAddress,
  );

  const ubLuna = useCW20Balance<bLuna>(
    contractAddress.cw20.bLuna,
    terraWalletAddress,
  );

  const ubLunaLunaLP = useCW20Balance<bLunaLunaLP>(
    contractAddress.cw20.bLunaLunaLP,
    terraWalletAddress,
  );

  return useMemo(() => {
    return {
      tax: {
        taxRate,
        maxTaxUUSD: maxTax,
      },
      tokenBalances: {
        ...DefaultAnchorTokenBalances,
        uUST,
        uANC,
        uAncUstLP,
        uaUST,
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
    ubLuna,
    ubLunaLunaLP,
  ]);
}
