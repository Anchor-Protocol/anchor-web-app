import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { Error } from '@material-ui/icons';
import { Data as MarketOverview } from 'pages/borrow/queries/marketOverview';
import styled from 'styled-components';

export interface LoanListProps {
  className?: string;
  marketOverview: MarketOverview | undefined;
}

function LoanListBase({ className }: LoanListProps) {
  return (
    <Section className={`loan-list ${className}`}>
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
            <th>APR / Accrued</th>
            <th>Borrowed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 2 }, (_, i) => (
            <tr key={'collateral-list' + i}>
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
                <div className="value">3.19%</div>
                <p className="volatility">200 UST</p>
              </td>
              <td>
                <div className="value">120K UST</div>
                <p className="volatility">200k USD</p>
              </td>
              <td>
                <ActionButton>Borrow</ActionButton>
                <ActionButton>Repay</ActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </HorizontalScrollTable>
    </Section>
  );
}

export const LoanList = styled(LoanListBase)`
  // TODO
`;
