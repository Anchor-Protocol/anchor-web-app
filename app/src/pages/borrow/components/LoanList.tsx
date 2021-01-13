import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  formatPercentage,
  formatUSTWithPostfixUnits,
  MICRO,
} from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { Error } from '@material-ui/icons';
import big from 'big.js';
import { BLOCKS_PER_YEAR } from 'constants/BLOCKS_PER_YEAR';
import { useBorrowDialog } from 'pages/borrow/components/useBorrowDialog';
import { useRepayDialog } from 'pages/borrow/components/useRepayDialog';
import { Data as MarketOverview } from 'pages/borrow/queries/marketOverview';
import { useMemo } from 'react';
import styled from 'styled-components';

export interface LoanListProps {
  className?: string;
  marketOverview: MarketOverview | undefined;
}

function LoanListBase({ className, marketOverview }: LoanListProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status } = useWallet();

  const [openBorrowDialog, borrowDialogElement] = useBorrowDialog();
  const [openRepayDialog, repayDialogElement] = useRepayDialog();

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const apr = useMemo(() => {
    return big(marketOverview?.borrowRate.rate ?? 0).mul(BLOCKS_PER_YEAR);
  }, [marketOverview?.borrowRate.rate]);

  const borrowed = useMemo(() => {
    return big(marketOverview?.loanAmount.loan_amount ?? 0);
  }, [marketOverview?.loanAmount.loan_amount]);

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
            <th>APR / Interest Accrued</th>
            <th>Borrowed</th>
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
              <div className="value">{formatPercentage(apr)}%</div>
              <p className="volatility">
                <s>200 UST</s>
              </p>
            </td>
            <td>
              <div className="value">
                {formatUSTWithPostfixUnits(borrowed.div(MICRO))} UST
              </div>
              <p className="volatility">
                {formatUSTWithPostfixUnits(borrowed.div(MICRO))} USD
              </p>
            </td>
            <td>
              <ActionButton
                disabled={status.status !== 'ready' || !marketOverview}
                onClick={() =>
                  openBorrowDialog({
                    marketOverview: marketOverview!,
                  })
                }
              >
                Borrow
              </ActionButton>
              <ActionButton
                disabled={
                  status.status !== 'ready' ||
                  !marketOverview ||
                  big(marketOverview.loanAmount.loan_amount).lte(0)
                }
                onClick={() =>
                  openRepayDialog({ marketOverview: marketOverview! })
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
