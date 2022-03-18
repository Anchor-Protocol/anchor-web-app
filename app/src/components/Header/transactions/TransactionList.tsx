import React, { ReactNode } from 'react';
import { UIElementProps } from '@libs/ui';
import { ButtonList } from '../shared';
import { screen } from 'env';
import styled from 'styled-components';
import { TransactionDisplay } from './TransactionDisplay';
import { Transaction, useTransactions } from 'tx/evm';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';

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
        <TransactionDisplay key={tx.txHash} tx={tx} />
      ))}
      <BorderButton className="clear-all" onClick={removeAll}>
        Clear all
      </BorderButton>
    </ButtonList>
  );
}

export const TransactionList = styled(TransactionListBase)`
  padding: 32px 28px 32px 28px;
  width: 350px;

  @media (max-width: ${screen.mobile.max}px) {
    width: 300px;
  }

  .clear-all {
    height: 25px !important;
    margin-top: 5px;
  }
`;
