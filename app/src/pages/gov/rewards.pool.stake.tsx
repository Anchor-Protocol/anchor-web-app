import styled from 'styled-components';

export interface RewardsPoolStakeProps {
  className?: string;
}

function RewardsPoolStakeBase({ className }: RewardsPoolStakeProps) {
  return <div className={className}>...</div>;
}

export const RewardsPoolStake = styled(RewardsPoolStakeBase)`
  // TODO
`;
