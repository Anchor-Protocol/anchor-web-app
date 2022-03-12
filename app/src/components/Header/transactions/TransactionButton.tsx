import React, { DOMAttributes } from 'react';
import { UIElementProps } from '@libs/ui';
import styled, { useTheme } from 'styled-components';
import { CircleSpinner } from 'react-spinners-kit';
import { Transaction } from 'tx/evm';

interface TransactionButtonProps
  extends UIElementProps,
    Pick<DOMAttributes<HTMLButtonElement>, 'onClick'> {
  backgroundTransactions: Transaction[];
}

const TransactionButtonBase = (props: TransactionButtonProps) => {
  const { className, onClick, backgroundTransactions } = props;
  const theme = useTheme();

  return (
    <button className={className} onClick={onClick}>
      <div className="note">{backgroundTransactions.length} transaction</div>
      <CircleSpinner size={15} color={theme.colors.secondary} />
    </button>
  );
};

export const TransactionButton = styled(TransactionButtonBase)`
  height: 26px;
  border-radius: 20px;
  padding: 4px 17px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  outline: none;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;

  .note {
    margin-right: 10px;
  }

  .gurPHt {
    border-width: 2px;
  }
`;
