import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { useConfirm } from '@libs/neumorphism-ui/components/useConfirm';
import { StreamStatus } from '@rx-stream/react';
import React from 'react';
import { useMutation } from 'react-query';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { TxResultModal } from 'components/tx/TxResultModal';
import { useEndPollTx } from 'tx/terra';
import { useNetwork } from '@anchor-protocol/app-provider';
import { NetworkMoniker } from '@anchor-protocol/types';

interface EndPollProps {
  pollId: number;
}

export const EndPoll = ({ pollId }: EndPollProps) => {
  const [openConfirm, confirmElement] = useConfirm();
  const { moniker: networkMoniker } = useNetwork();

  const [endPoll, endPollResult] = useEndPollTx();

  const { mutate: requestEndPoll } = useMutation(async () => {
    const didConfirm = await openConfirm({
      description: 'Do you want to end the poll?',
      agree: 'Proceed',
      disagree: 'Cancel',
    });

    if (!didConfirm || !endPoll) {
      return;
    }

    endPoll({
      pollId,
    });
  });

  if (networkMoniker !== NetworkMoniker.Testnet) {
    return null;
  }

  if (
    endPollResult?.status === StreamStatus.IN_PROGRESS ||
    endPollResult?.status === StreamStatus.DONE
  ) {
    return (
      <TxResultModal>
        <TxResultRenderer
          resultRendering={endPollResult.value}
          onExit={() => {
            switch (endPollResult.status) {
              case StreamStatus.IN_PROGRESS:
                endPollResult.abort();
                break;
              case StreamStatus.DONE:
                endPollResult.clear();
                break;
            }
          }}
        />
      </TxResultModal>
    );
  }

  return (
    <>
      <BorderButton onClick={requestEndPoll}>End poll</BorderButton>
      {confirmElement}
    </>
  );
};
