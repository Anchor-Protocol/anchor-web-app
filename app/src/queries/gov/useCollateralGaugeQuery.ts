import { useWhitelistCollateralQuery } from 'queries/collateral/useWhitelistCollateralQuery';
import { useMemo } from 'react';
import { useCollateralGaugeAddrQuery } from './useCollateralGaugeAddrQuery';
import { CW20Addr, u } from '@libs/types';
import Big, { BigSource } from 'big.js';
import { veANC } from '@anchor-protocol/types';
import { useGaugeWeightsQuery } from './useGaugeWeightsQuery';
import { sum } from '@libs/big-math';

export interface GaugeCollateral {
  tokenAddress: CW20Addr;
  symbol: string;
  name: string;
  icon?: string;
  votes: u<veANC<BigSource>>;
  share: number;
}

interface CollateralGauge {
  collateral: GaugeCollateral[];
  collateralRecord: Record<CW20Addr, GaugeCollateral>;
  totalVotes: u<veANC<BigSource>>;
}

export const useCollateralGaugeQuery = () => {
  const { data: gaugeAddr } = useCollateralGaugeAddrQuery();

  const { data: gaugeWeights } = useGaugeWeightsQuery({
    addresses: gaugeAddr || [],
    enabled: !!gaugeAddr,
  });

  const { data: whitelistCollateral } = useWhitelistCollateralQuery({
    enabled: !!gaugeAddr,
  });

  const data: CollateralGauge | undefined = useMemo(() => {
    if (!whitelistCollateral || !gaugeAddr || !gaugeWeights) {
      return undefined;
    }

    const totalVotes = sum(...Object.values(gaugeWeights)) as u<
      veANC<BigSource>
    >;

    const collateral: GaugeCollateral[] = whitelistCollateral
      .filter((collateral) => gaugeAddr.includes(collateral.collateral_token))
      .map(({ collateral_token, symbol, name, icon }) => {
        const votes = gaugeWeights[collateral_token];
        return {
          tokenAddress: collateral_token,
          symbol,
          name,
          icon,
          votes,
          share: Big(votes).div(totalVotes).toNumber(),
        };
      });

    const collateralRecord = collateral.reduce(
      (acc, collateral) => ({
        ...acc,
        [collateral.tokenAddress]: collateral,
      }),
      {} as Record<CW20Addr, GaugeCollateral>,
    );

    return {
      collateral,
      totalVotes,
      collateralRecord,
    };
  }, [gaugeAddr, gaugeWeights, whitelistCollateral]);

  return { data };
};
