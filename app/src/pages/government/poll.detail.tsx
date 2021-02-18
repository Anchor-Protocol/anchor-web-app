import styled from 'styled-components';

export interface PollDetailProps {
  className?: string;
}

function PollDetailBase({ className }: PollDetailProps) {
  return <div className={className}>...</div>;
}

export const PollDetail = styled(PollDetailBase)`
  // TODO
`;
