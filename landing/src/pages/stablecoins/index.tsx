import styled from 'styled-components';

export interface StableCoinsProps {
  className?: string;
}

function StableCoinsBase({ className }: StableCoinsProps) {
  return <div className={className}>...</div>;
}

export const StableCoins = styled(StableCoinsBase)`
  // TODO
`;