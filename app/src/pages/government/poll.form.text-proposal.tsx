import styled from 'styled-components';

export interface PollFormTextProposalProps {
  className?: string;
}

function PollFormTextProposalBase({ className }: PollFormTextProposalProps) {
  return <div className={className}>...</div>;
}

export const PollFormTextProposal = styled(PollFormTextProposalBase)`
  // TODO
`;
