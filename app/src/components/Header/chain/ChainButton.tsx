import React, { DOMAttributes } from 'react';
import { UIElementProps } from '@libs/ui';
import styled from 'styled-components';
import { useDeploymentTarget } from '@anchor-protocol/app-provider';

interface ChainButtonProps
  extends UIElementProps,
    Pick<DOMAttributes<HTMLButtonElement>, 'onClick'> {}

const ChainButtonBase = (props: ChainButtonProps) => {
  const { className, onClick } = props;
  const {
    target: { chain },
  } = useDeploymentTarget();
  return (
    <button className={className} onClick={onClick}>
      <div className="chain-name">{chain}</div>
    </button>
  );
};

export const ChainButton = styled(ChainButtonBase)`
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
