import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  formatPercentage,
  formatUSTWithPostfixUnits,
  MICRO,
} from '@anchor-protocol/notation';
import big from 'big.js';
import { BLOCKS_PER_YEAR } from 'constants/BLOCKS_PER_YEAR';
import { BorrowLimitGraph } from 'pages/borrow/components/BorrowLimitGraph';
import { Data as MarketUserOverview } from 'pages/borrow/queries/marketUserOverview';
import { useMemo } from 'react';
import styled from 'styled-components';
import { Data as MarketOverview } from '../queries/marketOverview';

export interface OverviewProps {
  className?: string;
  marketOverview: MarketOverview | undefined;
  marketUserOverview: MarketUserOverview | undefined;
}

function OverviewBase({
  className,
  marketOverview,
  marketUserOverview,
}: OverviewProps) {
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
          <label>
            <IconSpan>
              APR{' '}
              <InfoTooltip>
                Annual Percentage Rate. Current rate of interest on UST loans
              </InfoTooltip>
            </IconSpan>
          </label>
          <p>{formatPercentage(apr.mul(100))}%</p>
        </div>

        <div>
          <label>
            <IconSpan>
              Collateral Value{' '}
              <InfoTooltip>
                The sum of all deposited collaterals denominated in UST
              </InfoTooltip>
            </IconSpan>
          </label>
          <p>${formatUSTWithPostfixUnits(collateralValue.div(MICRO))}</p>
        </div>

        <div>
          <label>
            <IconSpan>
              Borrowed Value{' '}
              <InfoTooltip>The sum of all UST borrowed from Anchor</InfoTooltip>
            </IconSpan>
          </label>
          <p>${formatUSTWithPostfixUnits(borrowedValue.div(MICRO))}</p>
        </div>
      </article>

      <figure>
        <BorrowLimitGraph
          bLunaMaxLtv={marketOverview?.bLunaMaxLtv ?? 0}
          collateralValue={collateralValue}
          loanAmount={marketUserOverview?.loanAmount.loan_amount ?? 0}
        />
      </figure>
    </Section>
  );
}

export const Overview = styled(OverviewBase)`
  // TODO
`;
