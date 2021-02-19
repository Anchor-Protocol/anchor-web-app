import styled from 'styled-components';

export interface RewardsClaimProps {
  className?: string;
}

function RewardsClaimBase({ className }: RewardsClaimProps) {
  return <div className={className}>...</div>;
}

export const RewardsClaim = styled(RewardsClaimBase)`
  // TODO
`;
