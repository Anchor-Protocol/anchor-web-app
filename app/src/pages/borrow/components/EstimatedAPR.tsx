import {
  AnimateNumber,
  demicrofy,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, UST, uUST } from '@anchor-protocol/types';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Tab } from '@terra-dev/neumorphism-ui/components/Tab';
import big, { Big } from 'big.js';
import { useMemo, useState } from 'react';
import { apr as _apr } from 'pages/borrow/logics/apr';

import { useAnchorWebapp, useBorrowAPYQuery, useBorrowBorrowerQuery, useBorrowMarketQuery } from '@anchor-protocol/webapp-provider';

export interface EstimatedAPRProps {
  className?: string;
}

export type Period = 'total' | 'year' | 'month' | 'week' | 'day' | 'epoch';

interface Item {
  label: string;
  value: Period;
}

const tabItems: Item[] = [
  {
    label: 'WEEK',
    value: 'week',
  },
  {
    label: 'DAY',
    value: 'day',
  }, {
    label: 'EPOCH',
    value: 'epoch',
  },
];

export function EstimatedAPR({ className }: EstimatedAPRProps) {

  const {
    constants: { epochsPerYear, blocksPerYear },
  } = useAnchorWebapp();

  const { data: { borrowerDistributionAPYs } = {} } = useBorrowAPYQuery();
  
  const {
    data: { marketBorrowerInfo } = {},
  } = useBorrowBorrowerQuery();
  
  const {
    data: { borrowRate } = {},
  } = useBorrowMarketQuery();
  
  const apr = useMemo(() => _apr(borrowRate, blocksPerYear), [
    blocksPerYear,
    borrowRate,
  ]);
 
  const aprNet = useMemo(
    () => 
      borrowerDistributionAPYs && borrowerDistributionAPYs.length > 0
      ? (big(borrowerDistributionAPYs[0].DistributionAPY).minus(
          apr,
        ) as Rate<Big>)
      : (0 as Rate<number>),
    [borrowerDistributionAPYs, apr]
  );

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [tab, setTab] = useState<Item>(() => tabItems[1]);

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const estimatedReturn = useMemo(() => {
    if (!marketBorrowerInfo) {
      return undefined;
    }

    return (big(marketBorrowerInfo.loan_amount).mul(aprNet)
      .div(
        tab.value === 'week'
          ? 52
          : tab.value === 'day'
            ? 365
            : tab.value === 'epoch'
              ? epochsPerYear
              : 365
      )) as uUST<Big>;
  }, [
    marketBorrowerInfo,
    aprNet,
    tab.value,
    epochsPerYear
  ]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (

    <div className="apy">
      <h3>
        <IconSpan>
          Estimated Interest at stable APR{' '}
          <InfoTooltip>
            Estimated interest (not compounded) for the selected time period. Highly unlikely to be accurate above day period.
              </InfoTooltip>
        </IconSpan>
      </h3>
      <div className="value">
        $
        <AnimateNumber format={formatUSTWithPostfixUnits}>
          {estimatedReturn ? demicrofy(estimatedReturn) : (0 as UST<number>)}
        </AnimateNumber>
      </div>
      <Tab
        className="tab"
        items={tabItems}
        selectedItem={tab ?? tabItems[0]}
        onChange={setTab}
        labelFunction={({ label }) => label}
        keyFunction={({ value }) => value}
        height={46}
        borderRadius={30}
        fontSize={12}
      />
    </div>
  );
}
