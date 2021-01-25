import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  demicrofy,
  formatRatioToPercentage,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { Error } from '@material-ui/icons';
import big from 'big.js';
import { useBorrowDialog } from 'pages/borrow/components/useBorrowDialog';
import { useRepayDialog } from 'pages/borrow/components/useRepayDialog';
import { useAPR } from 'pages/borrow/logics/useAPR';
import { useBorrowed } from 'pages/borrow/logics/useBorrowed';
import { Data as MarketBalance } from 'pages/borrow/queries/marketBalanceOverview';
import { Data as MarketOverview } from 'pages/borrow/queries/marketOverview';
import { Data as MarketUserOverview } from 'pages/borrow/queries/marketUserOverview';
import styled from 'styled-components';

export interface LoanListProps {
  className?: string;
  marketBalance: MarketBalance | undefined;
  marketOverview: MarketOverview | undefined;
  marketUserOverview: MarketUserOverview | undefined;
}

function LoanListBase({
  className,
  marketBalance,
  marketOverview,
  marketUserOverview,
}: LoanListProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status } = useWallet();

  const [openBorrowDialog, borrowDialogElement] = useBorrowDialog();
  const [openRepayDialog, repayDialogElement] = useRepayDialog();

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const apr = useAPR(marketOverview?.borrowRate.rate);
  const borrowed = useBorrowed(marketUserOverview?.loanAmount.loan_amount);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
      <h2>LOAN LIST</h2>

      <HorizontalScrollTable>
        <colgroup>
          <col style={{ width: 300 }} />
          <col style={{ width: 200 }} />
          <col style={{ width: 200 }} />
          <col style={{ width: 300 }} />
        </colgroup>
        <thead>
          <tr>
            <th>Name</th>
            <th>
              <IconSpan>
                APR / Interest Accrued{' '}
                <InfoTooltip>
                  Current rate of annualized borrowing interest applied for this
                  stablecoin / The amount of interest accrued on open loans
                </InfoTooltip>
              </IconSpan>
            </th>
            <th>
              <IconSpan>
                Borrowed{' '}
                <InfoTooltip>
                  The borrow amount for this specific stablecoin / The borrow
                  amount for this specific stablecoin in USD
                </InfoTooltip>
              </IconSpan>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <i>
                <Error />
              </i>
              <div>
                <div className="coin">UST</div>
                <p className="name">Terra USD</p>
              </div>
            </td>
            <td>
              <div className="value">{formatRatioToPercentage(apr)}%</div>
              <p className="volatility">
                <s>200 UST</s>
              </p>
            </td>
            <td>
              <div className="value">
                {formatUSTWithPostfixUnits(demicrofy(borrowed))} UST
              </div>
              <p className="volatility">
                {formatUSTWithPostfixUnits(demicrofy(borrowed))} USD
              </p>
            </td>
            <td>
              <ActionButton
                disabled={
                  status.status !== 'ready' ||
                  !marketOverview ||
                  !marketUserOverview
                }
                onClick={() =>
                  openBorrowDialog({
                    marketOverview: marketOverview!,
                    marketUserOverview: marketUserOverview!,
                  })
                }
              >
                Borrow
              </ActionButton>
              <ActionButton
                disabled={
                  status.status !== 'ready' ||
                  !marketBalance ||
                  !marketOverview ||
                  !marketUserOverview ||
                  big(marketUserOverview.loanAmount.loan_amount).lte(0)
                }
                onClick={() =>
                  openRepayDialog({
                    marketBalance: marketBalance!,
                    marketOverview: marketOverview!,
                    marketUserOverview: marketUserOverview!,
                  })
                }
              >
                Repay
              </ActionButton>
            </td>
          </tr>
        </tbody>
      </HorizontalScrollTable>

      {borrowDialogElement}
      {repayDialogElement}
    </Section>
  );
}

export const LoanList = styled(LoanListBase)`
  // TODO
`;
