import styled from 'styled-components';

export interface MarketProps {
  className?: string;
}

function MarketBase({ className }: MarketProps) {
  return <div className={className}>...</div>;
}

export const Market = styled(MarketBase)`
  // TODO
`;