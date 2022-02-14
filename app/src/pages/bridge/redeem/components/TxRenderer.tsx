import React from 'react';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { UIElementProps } from 'components/layouts/UIElementProps';
import { useHistory } from 'react-router-dom';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { StreamStatus, StreamInProgress, StreamDone } from '@rx-stream/react';
import { TxResultRendering } from '@libs/app-fns';

interface LoadingProps extends UIElementProps {
  txResult:
    | StreamInProgress<TxResultRendering<unknown>>
    | StreamDone<TxResultRendering<unknown>>;
}

function TxRendering(props: LoadingProps) {
  const { className, txResult } = props;

  const history = useHistory();

  const onExit =
    txResult.status === StreamStatus.DONE
      ? () => history.push('/mypage')
      : () => {};

  return (
    <CenteredLayout className={className} maxWidth={800}>
      <Section>
        <TxResultRenderer resultRendering={txResult.value} onExit={onExit} />
      </Section>
    </CenteredLayout>
  );
}

export { TxRendering };
