import styled from 'styled-components';

export interface PollCreateProps {
  className?: string;
}

function PollCreateBase({ className }: PollCreateProps) {
  return <div className={className}>...</div>;
}

export const PollCreate = styled(PollCreateBase)`
  // TODO
`;
