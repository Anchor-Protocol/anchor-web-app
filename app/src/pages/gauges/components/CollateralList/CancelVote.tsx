import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { useConfirm } from '@libs/neumorphism-ui/components/useConfirm';
import { CW20Addr } from '@libs/types';
import React from 'react';
import { useMutation } from 'react-query';

interface CancelVoteProps {
  tokenAddress: CW20Addr;
  disabled: boolean;
}

export const CancelVote = ({ tokenAddress, disabled }: CancelVoteProps) => {
  const [openConfirm, confirmElement] = useConfirm();

  const { mutate: requestCancelVote } = useMutation(async () => {
    const didConfirm = await openConfirm({
      description: 'Do you want to cancel the vote?',
      agree: 'Proceed',
      disagree: 'Cancel',
    });

    if (!didConfirm) {
      return;
    }

    // TODO: make a request to cancel the vote
    console.log(`request cancel vote ${tokenAddress}`);
  });

  return (
    <>
      <BorderButton onClick={requestCancelVote} disabled={disabled}>
        Cancel
      </BorderButton>
      {confirmElement}
    </>
  );
};
