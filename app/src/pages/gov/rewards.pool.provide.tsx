import styled from 'styled-components';

export interface RewardsPoolProvideProps {
  className?: string;
}

function RewardsPoolProvideBase({ className }: RewardsPoolProvideProps) {
  return <div className={className}>...</div>;
}

export const RewardsPoolProvide = styled(RewardsPoolProvideBase)`
  // TODO
`;
