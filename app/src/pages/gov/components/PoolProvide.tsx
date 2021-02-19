import styled from 'styled-components';

export interface PoolProvideProps {
  className?: string;
}

function PoolProvideBase({ className }: PoolProvideProps) {
  return <div className={className}>Provide</div>;
}

export const PoolProvide = styled(PoolProvideBase)`
  // TODO
`;
