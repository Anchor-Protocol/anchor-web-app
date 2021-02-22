import styled from 'styled-components';

export interface TradeBuyProps {
  className?: string;
}

function TradeBuyBase({ className }: TradeBuyProps) {
  return <div className={className}>Buy</div>;
}

export const TradeBuy = styled(TradeBuyBase)`
  // TODO
`;
