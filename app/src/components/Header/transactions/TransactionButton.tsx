import React, { DOMAttributes } from 'react';
import { UIElementProps } from '@libs/ui';
import styled from 'styled-components';
import { CircleSpinner } from 'react-spinners-kit';
import { Transaction } from 'tx/evm';
import { pluralize } from 'tx/evm/utils';
import { useEffectOnce } from 'usehooks-ts';

interface TransactionButtonProps
  extends UIElementProps,
    Pick<DOMAttributes<HTMLButtonElement>, 'onClick'> {
  backgroundTransactions: Transaction[];
  closeWidget: () => void;
  color: string;
}

const TransactionButtonBase = (props: TransactionButtonProps) => {
  const { className, onClick, backgroundTransactions, closeWidget, color } =
    props;

  useEffectOnce(() => {
    closeWidget();
    return () => {
      closeWidget();
    };
  });

  return (
    <button
      className={className}
      onClick={onClick}
      style={{ color, borderColor: color }}
    >
      <div className="note">
        {backgroundTransactions.length}{' '}
        {pluralize('transaction', backgroundTransactions)}
      </div>
      <CircleSpinner size={12} color={color} />
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
  color: ${({ theme }) => theme.header.textColor};
  border: 1px solid ${({ theme }) => theme.header.textColor};
  outline: none;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;

  .note {
    margin-right: 8px;
  }

  .gurPHt {
    border-width: 2px;
  }
`;
