import React from 'react';
import { TxResultRendering } from '@libs/app-fns';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { UIElementProps } from '@libs/ui';
import { StreamResult, StreamStatus } from '@rx-stream/react';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface ClaimAllProps extends UIElementProps {
  txResult: StreamResult<TxResultRendering> | null;
}

function ClaimAllBase(props: ClaimAllProps) {
  const { className, children, txResult } = props;

  const navigate = useNavigate();

  if (
    txResult?.status === StreamStatus.IN_PROGRESS ||
    txResult?.status === StreamStatus.DONE
  ) {
    const onExit =
      txResult.status === StreamStatus.DONE
        ? () => navigate('/mypage')
        : () => {};

    return (
      <CenteredLayout className={className} maxWidth={800}>
        <Section>
          <TxResultRenderer resultRendering={txResult.value} onExit={onExit} />
        </Section>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout className={className} maxWidth={800}>
      {children}
    </CenteredLayout>
  );
}

export const ClaimAll = styled(ClaimAllBase)`
  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    margin-bottom: 50px;
  }

  .receipt {
    margin-top: 30px;
  }

  .button {
    margin-top: 40px;

    width: 100%;
    height: 60px;
  }
`;
