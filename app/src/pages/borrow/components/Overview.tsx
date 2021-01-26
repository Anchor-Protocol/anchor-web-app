import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  demicrofy,
  formatRatioToPercentage,
  formatUSTWithPostfixUnits,
  Ratio,
  uUST,
} from '@anchor-protocol/notation';
import { BigSource } from 'big.js';
import { BorrowLimitGraph } from 'pages/borrow/components/BorrowLimitGraph';
import { useMarket } from 'pages/borrow/context/market';
import { useAPR } from 'pages/borrow/logics/useAPR';
import { useBorrowed } from 'pages/borrow/logics/useBorrowed';
import { useCollaterals } from 'pages/borrow/logics/useCollaterals';
import styled from 'styled-components';

export interface OverviewProps {
  className?: string;
}

function OverviewBase({ className }: OverviewProps) {
  const { marketOverview, marketUserOverview } = useMarket();

  const apr = useAPR(marketOverview?.borrowRate.rate);
  const borrowed = useBorrowed(marketUserOverview?.loanAmount.loan_amount);
  const collaterals = useCollaterals(
    marketUserOverview?.borrowInfo.balance,
    marketUserOverview?.borrowInfo.spendable,
    marketOverview?.oraclePrice.rate,
  );

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
                Annual Percentage Rate.
                <br />
                The annualized rate of current interest on loans in USD
              </InfoTooltip>
            </IconSpan>
          </label>
          <p>{formatRatioToPercentage(apr)}%</p>
        </div>

        <div>
          <label>
            <IconSpan>
              Collateral Value{' '}
              <InfoTooltip>
                The sum of all collaterals deposited by the user, in USD
              </InfoTooltip>
            </IconSpan>
          </label>
          <p>${formatUSTWithPostfixUnits(demicrofy(collaterals))}</p>
        </div>

        <div>
          <label>
            <IconSpan>
              Borrowed Value{' '}
              <InfoTooltip>
                The sum of all loans borrowed by the user, in USD
              </InfoTooltip>
            </IconSpan>
          </label>
          <p>${formatUSTWithPostfixUnits(demicrofy(borrowed))}</p>
        </div>
      </article>

      <figure>
        <BorrowLimitGraph
          bLunaMaxLtv={marketOverview?.bLunaMaxLtv ?? (0 as Ratio<BigSource>)}
          collateralValue={collaterals}
          loanAmount={
            marketUserOverview?.loanAmount.loan_amount ?? (0 as uUST<BigSource>)
          }
        />
      </figure>
    </Section>
  );
}

export const Overview = styled(OverviewBase)`
  // TODO
`;
