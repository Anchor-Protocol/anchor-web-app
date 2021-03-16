import { demicrofy, formatUST, truncate } from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { HorizontalHeavyRuler } from '@terra-dev/neumorphism-ui/components/HorizontalHeavyRuler';
import { Pagination } from '@terra-dev/neumorphism-ui/components/Pagination';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { useArrayPagination } from '@terra-dev/use-array-pagination';
import { useTransactionHistory } from 'pages/earn/queries/transactionHistory';
import { useMemo } from 'react';
import styled from 'styled-components';

export interface TransactionHistorySectionProps {
  className?: string;
}

export function TransactionHistorySection({
  className,
}: TransactionHistorySectionProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status } = useWallet();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const {
    data: { transactionHistory = [] },
  } = useTransactionHistory();

  const filteredHistory = useMemo(() => {
    return transactionHistory.filter(
      ({ TransactionType }) =>
        TransactionType === 'deposit_stable' ||
        TransactionType === 'redeem_stable',
    );
  }, [transactionHistory]);

  const { page, pageIndex, paging } = useArrayPagination(filteredHistory, 3);

  console.log(
    'TRANSACTION HISTORY CURRENT PAGE ITEMS',
    JSON.stringify({ page }, null, 2),
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
      <h2>TRANSACTION HISTORY</h2>

      <HorizontalHeavyRuler />

      {filteredHistory.length > 0 ? (
        <>
          <ul className="list">
            {page.map(
              ({
                Address,
                TxHash,
                InAmount,
                OutAmount,
                TransactionType,
                Timestamp,
              }) => {
                const datetime: Date = new Date(Timestamp * 1000);

                return (
                  <li key={'history' + TxHash}>
                    <div className="amount">
                      {TransactionType === 'deposit_stable'
                        ? `+${formatUST(demicrofy(InAmount))}`
                        : `-${formatUST(demicrofy(OutAmount))}`}{' '}
                      UST
                    </div>
                    <div className="detail">
                      <span>
                        {TransactionType === 'deposit_stable'
                          ? 'Deposit from'
                          : 'Redeem to'}{' '}
                        <a
                          href={`https://finder.terra.money/${status.network.chainID}/account/${Address}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {truncate(Address)}
                        </a>
                      </span>
                      <time>
                        {datetime.toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        {datetime.toLocaleTimeString()}
                      </time>
                    </div>
                  </li>
                );
              },
            )}
          </ul>
          <Pagination
            className="pagination"
            totalItems={filteredHistory.length}
            pageIndex={pageIndex}
            viewPages={7}
            viewItems={3}
            onChange={paging}
          />
        </>
      ) : (
        <EmptyMessage>
          <h3>No transaction history</h3>
          <p>Looks like you haven't made any transactions yet.</p>
        </EmptyMessage>
      )}
    </Section>
  );
}

const EmptyMessage = styled.div`
  height: 280px;
  display: grid;
  place-content: center;
  text-align: center;

  h3 {
    font-size: 18px;
    font-weight: 500;

    margin-bottom: 8px;
  }

  p {
    font-size: 13px;
    color: ${({ theme }) => theme.dimTextColor};
  }
`;
