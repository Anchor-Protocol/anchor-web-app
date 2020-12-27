import styled from 'styled-components';

export interface IndexProps {
  className?: string;
}

function IndexBase({ className }: IndexProps) {
  return <div className={className}>
    Better Savings
  </div>;
}

export const Index = styled(IndexBase)`
  height: 100vh;
  
  background-color: #000000;
  color: #ffffff;
  
  font-size: 60px;
  
  display: grid;
  place-items: center;
`;