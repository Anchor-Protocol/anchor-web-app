import React, { DOMAttributes } from 'react';
import { UIElementProps } from '@libs/ui';
import styled, { useTheme } from 'styled-components';
import { useRedemptions } from 'tx/evm/storage/useRedemptions';
import { CircleSpinner } from 'react-spinners-kit';

interface RedemptionButtonProps
  extends UIElementProps,
    Pick<DOMAttributes<HTMLButtonElement>, 'onClick'> {}

const RedemptionButtonBase = (props: RedemptionButtonProps) => {
  const { className, onClick } = props;
  const { redemptions } = useRedemptions();
  const theme = useTheme();

  return (
    <button className={className} onClick={onClick}>
      <div className="note">{redemptions.length} transaction</div>
      <CircleSpinner size={15} color={theme.colors.secondary} />
    </button>
  );
};

export const RedemptionButton = styled(RedemptionButtonBase)`
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
