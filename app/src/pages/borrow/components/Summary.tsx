import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  formatPercentage,
  formatUSTWithPostfixUnits,
  MICRO,
} from '@anchor-protocol/notation';
import big from 'big.js';
import { BLOCKS_PER_YEAR } from 'constants/BLOCKS_PER_YEAR';
import { Data as MarketUserOverview } from 'pages/borrow/queries/marketUserOverview';
import { useMemo } from 'react';
import styled from 'styled-components';
import { Data as MarketOverview } from '../queries/marketOverview';

export interface SummaryProps {
  className?: string;
  marketOverview: MarketOverview | undefined;
  marketUserOverview: MarketUserOverview | undefined;
}

function SummaryBase({
  className,
  marketOverview,
  marketUserOverview,
}: SummaryProps) {
  const apr = useMemo(() => {
    return big(marketOverview?.borrowRate.rate ?? 0).mul(BLOCKS_PER_YEAR);
  }, [marketOverview?.borrowRate.rate]);

  const borrowedValue = useMemo(() => {
    return big(marketUserOverview?.loanAmount.loan_amount ?? 0);
  }, [marketUserOverview?.loanAmount.loan_amount]);

  const collateralValue = useMemo(() => {
    return big(
      big(marketUserOverview?.borrowInfo.balance ?? 0).minus(
        marketUserOverview?.borrowInfo.spendable ?? 0,
      ),
    ).mul(marketOverview?.oraclePrice.rate ?? 1);
  }, [
    marketOverview?.oraclePrice.rate,
    marketUserOverview?.borrowInfo.balance,
    marketUserOverview?.borrowInfo.spendable,
  ]);

  // TODO
  //const bLunaWhitelistElem = overseerWhitelist.Result.elems.find(
  //  (entry) => entry.collateral_token === addressProvider.bAssetToken('ubluna'),
  //);
  //
  //// will change in the future where there are more collateral types
  //const borrowLimitValue = collateralValue.mul(bLunaWhitelistElem.ltv);
  //const borrowLimitPercentage = big(loanAmount.Result.loan_amount).div(
  //  borrowLimitValue,
  //);

  return (
    <Section className={className}>
      <article>
        <div>
          <label>APR</label>
          <p>{formatPercentage(apr.mul(100))}%</p>
        </div>

        <div>
          <label>Collateral Value</label>
          <p>${formatUSTWithPostfixUnits(collateralValue.div(MICRO))}</p>
        </div>

        <div>
          <label>Borrowed Value</label>
          <p>${formatUSTWithPostfixUnits(borrowedValue.div(MICRO))}</p>
        </div>
      </article>

      <figure></figure>
    </Section>
  );
}

export const Summary = styled(SummaryBase)`
  // TODO
`;
