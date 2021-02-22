import styled from 'styled-components';

export interface TradeSellProps {
  className?: string;
}

function TradeSellBase({ className }: TradeSellProps) {
  return <div className={className}>Sell</div>;
}

export const TradeSell = styled(TradeSellBase)`
  // TODO
`;
