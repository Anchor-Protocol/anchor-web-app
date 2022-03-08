import React from 'react';
import { UIElementProps } from '@libs/ui';
import { ButtonList } from '../shared';
import styled from 'styled-components';
import { TransactionDisplay } from './TransactionDisplay';
import { useTransactions } from 'tx/evm/storage/useTransactions';

interface TransactionListProps extends UIElementProps {
  onClose: () => void;
}

function TransactionListBase(props: TransactionListProps) {
  const { className } = props;
  const { transactions } = useTransactions();

  return (
    <ButtonList className={className} title="Transactions">
      {transactions.map((tx) => (
        <TransactionDisplay key={tx.receipt.transactionHash} tx={tx} />
      ))}
    </ButtonList>
  );
}

export const TransactionList = styled(TransactionListBase)`
  padding: 20px 10px;
`;
