import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { useConfirm } from '@libs/neumorphism-ui/components/useConfirm';
import { CW20Addr } from '@libs/types';
import { StreamStatus } from '@rx-stream/react';
import React from 'react';
import { useMutation } from 'react-query';
import { useVoteForGaugeWeightTx } from 'tx/terra/useVoteForGaugeWeightTx';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { TxResultModal } from 'components/tx/TxResultModal';

interface CancelVoteProps {
  tokenAddress: CW20Addr;
  disabled: boolean;
}

export const CancelVote = ({ tokenAddress, disabled }: CancelVoteProps) => {
  const [openConfirm, confirmElement] = useConfirm();

  const [voteForGaugeWeight, voteForGaugeWeightResult] =
    useVoteForGaugeWeightTx();

  const { mutate: requestCancelVote } = useMutation(async () => {
    const didConfirm = await openConfirm({
      description: 'Do you want to cancel the vote?',
      agree: 'Proceed',
      disagree: 'Cancel',
    });

    if (!didConfirm || !voteForGaugeWeight) {
      return;
    }

    voteForGaugeWeight({
      gaugeAddr: tokenAddress,
      ratio: 0,
    });
  });

  if (
    voteForGaugeWeightResult?.status === StreamStatus.IN_PROGRESS ||
    voteForGaugeWeightResult?.status === StreamStatus.DONE
  ) {
    return (
      <TxResultModal>
        <TxResultRenderer
          resultRendering={voteForGaugeWeightResult.value}
          onExit={() => {
            switch (voteForGaugeWeightResult.status) {
              case StreamStatus.IN_PROGRESS:
                voteForGaugeWeightResult.abort();
                break;
              case StreamStatus.DONE:
                voteForGaugeWeightResult.clear();
                break;
            }
          }}
        />
      </TxResultModal>
    );
  }

  return (
    <>
      <BorderButton onClick={requestCancelVote} disabled={disabled}>
        Cancel
      </BorderButton>
      {confirmElement}
    </>
  );
};
