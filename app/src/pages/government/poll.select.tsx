import styled from 'styled-components';

export interface PollSelectProps {
  className?: string;
}

function PollSelectBase({ className }: PollSelectProps) {
  return <div className={className}>...</div>;
}

export const PollSelect = styled(PollSelectBase)`
  // TODO
`;
