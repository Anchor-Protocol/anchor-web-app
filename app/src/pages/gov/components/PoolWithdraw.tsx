import styled from 'styled-components';

export interface PoolWithdrawProps {
  className?: string;
}

function PoolWithdrawBase({ className }: PoolWithdrawProps) {
  return <div className={className}>Withdraw</div>;
}

export const PoolWithdraw = styled(PoolWithdrawBase)`
  // TODO
`;
