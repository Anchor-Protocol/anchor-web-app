import { Rate, uUST } from '@anchor-protocol/types';
import { useConstants } from 'base/contexts/contants';
import big, { Big } from 'big.js';
import { useMarketBluna } from 'pages/market-new/queries/marketBluna';
import { useMarketBorrow } from 'pages/market-new/queries/marketBorrow';
import { useMarketUST } from 'pages/market-new/queries/marketUST';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useMarketCollaterals } from './queries/marketCollateral';
import { useMarketDeposit } from './queries/marketDeposit';

export interface MarketProps {
  className?: string;
}

function MarketBase({ className }: MarketProps) {
  const { blocksPerYear } = useConstants();

  const { data: marketDeposit } = useMarketDeposit();
  const { data: marketBorrow } = useMarketBorrow();
  const { data: marketCollaterals } = useMarketCollaterals();
  const { data: marketUST } = useMarketUST();
  const { data: marketBluna } = useMarketBluna();

  const totalValueLockedBox = useMemo(() => {
    if (!marketDeposit || !marketCollaterals || !marketUST) {
      return undefined;
    }

    return {
      totalDeposit: marketDeposit.total_ust_deposits,
      totalCollaterals: marketCollaterals.total_value,
      totalValueLocked: big(marketDeposit.total_ust_deposits).plus(
        marketCollaterals.total_value,
      ) as uUST<Big>,
      yieldReserve: marketUST.overseer_ust_balance,
    };
  }, [marketCollaterals, marketDeposit, marketUST]);

  const stableCoinBox = useMemo(() => {
    if (!marketDeposit || !marketBorrow || !marketUST) {
      return undefined;
    }

    return {
      totalDeposit: marketDeposit.total_ust_deposits,
      totalBorrow: marketBorrow.total_borrowed,
      totalDepositGraph: 'TODO: API not ready...',
      totalBorrowGraph: 'TODO: API not ready...',
      totalDepositDiff: 'TODO: API not ready...',
      totalBorrowDiff: 'TODO: API not ready...',
      depositAPR: big(marketUST.deposit_rate).mul(blocksPerYear) as Rate<Big>,
      depositAPRDiff: 'TODO: API not ready...',
      borrowAPR: big(marketUST.borrow_rate).mul(blocksPerYear) as Rate<Big>,
      borrowAPRDiff: 'TODO: API not ready...',
    };
  }, [blocksPerYear, marketBorrow, marketDeposit, marketUST]);

  const collateralsBox = useMemo(() => {
    if (!marketCollaterals || !marketBluna) {
      return undefined;
    }

    return {
      mainTotalCollateralValue: marketCollaterals.total_value,
      totalCollateralValueGraph: 'TODO: API not ready...',
      blunaPrice: marketBluna.bLuna_price,
      blunaPriceDiff: 'TODO: API not ready...',
      totalCollateral: marketCollaterals.collaterals.find(
        ({ bluna }) => !!bluna,
      )?.bluna,
      totalCollateralDiff: 'TODO: API not ready...',
      totalCollateralValue: big(
        marketCollaterals.collaterals.find(({ bluna }) => !!bluna)?.bluna ?? 1,
      ).mul(marketBluna.bLuna_price),
      totalCollateralValueDiff: 'TODO: API not ready...',
    };
  }, [marketBluna, marketCollaterals]);

  return (
    <div className={className}>
      <section>
        <h1>Total Value Locked box</h1>
        <pre>{JSON.stringify(totalValueLockedBox, null, 2)}</pre>
      </section>

      <section>
        <h1>ANC Price box</h1>
        <pre>TODO: API not ready...</pre>
      </section>

      <section>
        <h1>ANC Buyback box</h1>
        <pre>TODO: API not ready...</pre>
      </section>

      <section>
        <h1>Stablecoin box</h1>
        <pre>{JSON.stringify(stableCoinBox, null, 2)}</pre>
      </section>

      <section>
        <h1>Collaterals box</h1>
        <pre>{JSON.stringify(collateralsBox, null, 2)}</pre>
      </section>
    </div>
  );
}

export const Market = styled(MarketBase)`
  padding: 20px;

  section {
    border: 1px solid black;
    padding: 10px;
  }
`;
