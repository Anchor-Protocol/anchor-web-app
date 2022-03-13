import React, { ReactNode } from 'react';
import { UIElementProps } from '@libs/ui';
import { ButtonList } from '../shared';
import styled from 'styled-components';
import { TransactionDisplay } from './TransactionDisplay';
import { Transaction, useTransactions } from 'tx/evm';

interface TransactionListProps extends UIElementProps {
  onClose: () => void;
  footer: ReactNode;
  backgroundTransactions: Transaction[];
}

function TransactionListBase(props: TransactionListProps) {
  const { className, footer } = props;
  const { removeAll } = useTransactions();

  return (
    <ButtonList className={className} title="Transactions" footer={footer}>
      {props.backgroundTransactions.map((tx) => (
        <TransactionDisplay key={tx.receipt.transactionHash} tx={tx} />
      ))}
      <div className="clear-all" onClick={removeAll}>
        Clear all
      </div>
    </ButtonList>
  );
}

export const TransactionList = styled(TransactionListBase)`
  padding: 32px 28px 32px 28px;

  .clear-all {
    display: flex;
    font-size: 12px;
    font-weight: 500;
    justify-content: center;
    cursor: pointer;
    margin-top: 20px;
    color: ${({ theme }) => theme.colors.secondaryDark};
  }
`;
