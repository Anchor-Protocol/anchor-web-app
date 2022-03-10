import React, { ReactNode } from 'react';
import { UIElementProps } from '@libs/ui';
import { ButtonList } from '../shared';
import styled from 'styled-components';
import { TransactionDisplay } from './TransactionDisplay';
import { useTransactions } from 'tx/evm/storage/useTransactions';

interface TransactionListProps extends UIElementProps {
  onClose: () => void;
  footer: ReactNode;
}

function TransactionListBase(props: TransactionListProps) {
  const { className, footer } = props;
  const { transactions } = useTransactions();

  return (
    <ButtonList className={className} title="Transactions" footer={footer}>
      {transactions.map((tx) => (
        <TransactionDisplay key={tx.receipt.transactionHash} tx={tx} />
      ))}
    </ButtonList>
  );
}

export const TransactionList = styled(TransactionListBase)`
  padding: 32px 28px 32px 28px;
`;
