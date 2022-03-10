import React from 'react';
import { UIElementProps } from '@libs/ui';
import styled from 'styled-components';
import { formatDistance } from 'date-fns';
import { truncateEvm } from '@libs/formatter';
import { Transaction } from 'tx/evm/storage/useTransactions';
import { formatTxKind } from 'tx/evm/utils';

interface TransactionDisplayProps extends UIElementProps {
  tx: Transaction;
}

function TransactionDisplayBase(props: TransactionDisplayProps) {
  const { className, tx } = props;

  return (
    <div className={className} key={tx.receipt.transactionHash}>
      <div className="details">
        <span className="action">{formatTxKind(tx.display.txKind)}</span>
        <span className="tx-hash">
          {truncateEvm(tx.receipt.transactionHash)}
        </span>
      </div>

      <div className="more-details">
        <div className="amount">{tx.display.amount ?? 'Unknown'}</div>
        <div className="timestamp">
          {formatDistance(tx.display.timestamp, new Date(), {
            addSuffix: true,
          })}
        </div>
      </div>
    </div>
  );
}

export const TransactionDisplay = styled(TransactionDisplayBase)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: 500;
  font-size: 10px;
  margin: 5px 10px;
  width: 300px;

  .button {
    background-color: ${({ theme }) =>
      theme.palette.type === 'light' ? '#f4f4f5' : '#2a2a46'};
    color: ${({ theme }) => theme.textColor};
  }

  .action {
    font-size: 12px;
    width: auto;
    height: 20px;
    line-height: 20px;
  }

  .details {
    display: flex;
    width: 100%;
    margin-bottom: 2px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .more-details {
    width: 100%;
    color: gray;
    display: flex;
  }

  .timestamp {
    margin-left: auto;
  }
`;
