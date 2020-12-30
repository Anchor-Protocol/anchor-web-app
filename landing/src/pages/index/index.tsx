//import { BetterSavings } from './components/BetterSavings';
import styled from 'styled-components';

export interface IndexProps {
  className?: string;
}

function IndexBase({ className }: IndexProps) {
  return (
    <div className={className}>
      {/*<BetterSavings style={{ height: 500 }} />*/}
    </div>
  );
}

export const Index = styled(IndexBase)`
  height: 100vh;

  background-color: #000000;
  color: #ffffff;

  font-size: 60px;

  display: grid;
  place-items: center;
`;
