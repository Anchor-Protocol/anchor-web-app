import styled from 'styled-components';

export interface RewardsStakeProps {
  className?: string;
}

function RewardsStakeBase({ className }: RewardsStakeProps) {
  return <div className={className}>...</div>;
}

export const RewardsStake = styled(RewardsStakeBase)`
  // TODO
`;
