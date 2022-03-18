import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { UIElementProps } from 'components/layouts/UIElementProps';
import React, { ChangeEvent, KeyboardEvent, useCallback } from 'react';
import styled from 'styled-components';
import { TxRendering } from './components/TxRenderer';
import { TextInput } from '@libs/neumorphism-ui/components/TextInput';
import { useRestoreTx } from 'tx/evm/useRestoreTx';
import { useRestoreTxForm } from './hooks';
import { StreamStatus } from '@rx-stream/react';

function RestoreBase(props: UIElementProps) {
  const { className } = props;

  const [input, state] = useRestoreTxForm();
  const [restoreTx, txResult] = useRestoreTx();

  const submit = useCallback(() => {
    if (restoreTx) {
      restoreTx({ txHash: state.txHash });
    }
  }, [state, restoreTx]);

  if (
    txResult?.status === StreamStatus.IN_PROGRESS ||
    txResult?.status === StreamStatus.DONE
  ) {
    return <TxRendering className={className} txResult={txResult} />;
  }

  return (
    <CenteredLayout className={className} maxWidth={800}>
      <Section>
        <h1>Restore</h1>
        <p className="text">
          Below you may attempt to restore a stuck transaction. In order to
          proceed with restoration, transaction hash is required.
        </p>

        <TextInput
          className="tx-hash"
          fullWidth
          placeholder="TRANSACTION HASH"
          value={state.txHash}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            input({ txHash: target.value })
          }
          onKeyPress={({ key }: KeyboardEvent<HTMLInputElement>) => {
            if (key === 'Enter') {
              submit();
            }
          }}
        />

        <ActionButton className="submit" onClick={submit}>
          Restore
        </ActionButton>
      </Section>
    </CenteredLayout>
  );
}

export const Restore = styled(RestoreBase)`
  h1 {
    text-align: center;
    font-size: 27px;
    font-weight: 500;

    margin-bottom: 60px;
  }

  p {
    margin-bottom: 30px;
  }

  .text {
    font-family: Gotham;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
  }

  .receipt,
  .error,
  .loading {
    margin: 30px 0 40px 0;
  }

  .error,
  .loading {
    display: flex;
    flex-direction: column;
  }

  .error {
    h2 {
      font-weight: 500;
      font-size: 1.3em;
      text-align: center;
      margin-top: 1em;
      margin-bottom: 1.2em;
    }
    .icon {
      color: ${({ theme }) => theme.colors.negative};
      margin: 0 auto;
      width: 6em;
      height: 6em;
      border-radius: 50%;
      border: 3px solid currentColor;
      display: grid;
      place-content: center;
      svg {
        font-size: 3em;
      }
    }
    .text {
      text-align: center;
      margin-top: 20px;
    }
  }

  .loading {
    .spinner {
      margin: 15px auto;
    }
  }

  .submit {
    margin-top: 30px;
    width: 100%;
    height: 60px;
  }
`;
