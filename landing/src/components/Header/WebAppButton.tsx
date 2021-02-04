import styled from 'styled-components';
import { Labtop } from '@anchor-protocol/icons';

export interface WebAppButtonProps {
  className?: string;
}

function WebAppButtonBase({ className }: WebAppButtonProps) {
  return (
    <button className={className}>
      <Labtop /> WebApp
    </button>
  );
}

export const WebAppButton = styled(WebAppButtonBase)`
  width: 124px;
  height: 36px;
  border-radius: 18px;
  border: 0;
  outline: none;
  cursor: pointer;

  font-size: 11px;
  font-weight: 700;

  svg {
    margin-left: 4px;
    margin-right: 9px;
    font-size: 1em;
    transform: scale(1.8) translateY(1px);
  }
`;
