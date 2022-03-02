import React, { DOMAttributes } from 'react';
import { UIElementProps } from '@libs/ui';
import styled from 'styled-components';
import { useRedemptionStorage } from 'tx/evm/storage/useRedemptionStorage';

interface RedemptionButtonProps
  extends UIElementProps,
    Pick<DOMAttributes<HTMLButtonElement>, 'onClick'> {}

const RedemptionButtonBase = (props: RedemptionButtonProps) => {
  const { className, onClick } = props;
  const { redemptions } = useRedemptionStorage();

  return (
    <button className={className} onClick={onClick}>
      <div>{redemptions.length} redemption pending</div>
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
`;
