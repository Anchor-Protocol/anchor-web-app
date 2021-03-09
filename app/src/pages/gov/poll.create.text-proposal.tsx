import { PollCreateBase } from 'pages/gov/components/PollCreateBase';
import React from 'react';

export function PollCreateTextProposal() {
  return (
    <PollCreateBase
      pollTitle="Text Proposal"
      submitDisabled={false}
      onCreateMsgs={() => undefined}
    >
      <span style={{ display: 'none' }} />
    </PollCreateBase>
  );
}
