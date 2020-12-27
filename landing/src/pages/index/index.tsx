import styled from 'styled-components';

export interface IndexProps {
  className?: string;
}

function IndexBase({ className }: IndexProps) {
  return <div className={className}>...</div>;
}

export const Index = styled(IndexBase)`
  // TODO
`;