import styled from 'styled-components';

export interface PoolStakeProps {
  className?: string;
}

function PoolStakeBase({ className }: PoolStakeProps) {
  return <div className={className}>Stake</div>;
}

export const PoolStake = styled(PoolStakeBase)`
  // TODO
`;
