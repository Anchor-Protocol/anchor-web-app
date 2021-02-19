import styled from 'styled-components';

export interface RewardsPoolWithdrawProps {
  className?: string;
}

function RewardsPoolWithdrawBase({ className }: RewardsPoolWithdrawProps) {
  return <div className={className}>...</div>;
}

export const RewardsPoolWithdraw = styled(RewardsPoolWithdrawBase)`
  // TODO
`;
