import React, { ReactNode } from 'react';
import { UIElementProps } from '@libs/ui';
import { ButtonList } from '../shared';
import styled from 'styled-components';
import { TransactionDisplay } from './TransactionDisplay';
import { Transaction } from 'tx/evm';

interface TransactionListProps extends UIElementProps {
  onClose: () => void;
  footer: ReactNode;
  backgroundTransactions: Transaction[];
}

function TransactionListBase(props: TransactionListProps) {
  const { className, footer } = props;
  return (
    <ButtonList className={className} title="Transactions" footer={footer}>
      {props.backgroundTransactions.map((tx) => (
        <TransactionDisplay key={tx.receipt.transactionHash} tx={tx} />
      ))}
    </ButtonList>
  );
}

export const TransactionList = styled(TransactionListBase)`
  padding: 32px 28px 32px 28px;
`;
