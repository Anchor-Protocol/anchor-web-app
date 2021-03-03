import styled from 'styled-components';

export interface ClaimUstBorrowProps {
  className?: string;
}

function ClaimUstBorrowBase({ className }: ClaimUstBorrowProps) {
  return <div className={className}>...</div>;
}

export const ClaimUstBorrow = styled(ClaimUstBorrowBase)`
  // TODO
`;
