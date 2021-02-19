import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { PollFormLayout } from 'pages/gov/components/PollFormLayout';
import styled from 'styled-components';

export interface pollCreateTextProposalProps {
  className?: string;
}

function pollCreateTextProposalBase({
  className,
}: pollCreateTextProposalProps) {
  return (
    <PollFormLayout className={className}>
      <Section>
        <h1>Submit Text Proposal</h1>
      </Section>
    </PollFormLayout>
  );
}

export const pollCreateTextProposal = styled(pollCreateTextProposalBase)`
  // TODO
`;
