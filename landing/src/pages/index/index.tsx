import { BetterSavings } from './components/BetterSavings';
import styled from 'styled-components';

export interface IndexProps {
  className?: string;
}

function IndexBase({ className }: IndexProps) {
  return (
    <div className={className}>
      <BetterSavings />
      <div style={{ height: 1500 }}>.</div>
    </div>
  );
}

export const Index = styled(IndexBase)`
  background-color: #000000;
  color: #ffffff;

  font-size: 60px;

  display: grid;
  place-items: center;
`;
