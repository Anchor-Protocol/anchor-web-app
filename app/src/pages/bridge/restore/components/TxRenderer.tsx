import React from 'react';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { UIElementProps } from 'components/layouts/UIElementProps';
import { useNavigate } from 'react-router-dom';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { StreamInProgress, StreamDone } from '@rx-stream/react';
import { TxResultRendering } from '@libs/app-fns';

interface LoadingProps extends UIElementProps {
  txResult:
    | StreamInProgress<TxResultRendering<unknown>>
    | StreamDone<TxResultRendering<unknown>>;
}

function TxRendering(props: LoadingProps) {
  const { className, txResult } = props;

  const navigate = useNavigate();

  return (
    <CenteredLayout className={className} maxWidth={800}>
      <Section>
        <TxResultRenderer
          resultRendering={txResult.value}
          onExit={() => navigate('/mypage')}
        />
      </Section>
    </CenteredLayout>
  );
}

export { TxRendering };
