import styled from 'styled-components';

export interface RewardsPoolProps {
  className?: string;
}

function RewardsPoolBase({ className }: RewardsPoolProps) {
  return <div className={className}>...</div>;
}

export const RewardsPool = styled(RewardsPoolBase)`
  // TODO
`;
