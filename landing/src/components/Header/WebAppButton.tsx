import styled from 'styled-components';

export interface WebAppButtonProps {
  className?: string;
}

function WebAppButtonBase({ className }: WebAppButtonProps) {
  return <button className={className}>WebApp</button>;
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
`;
