import styled from 'styled-components';

export interface PoolUnstakeProps {
  className?: string;
}

function PoolUnstakeBase({ className }: PoolUnstakeProps) {
  return <div className={className}>Unstake</div>;
}

export const PoolUnstake = styled(PoolUnstakeBase)`
  // TODO
`;
