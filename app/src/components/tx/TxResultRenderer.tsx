import { PollingTimeout } from '@libs/app-fns';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { HorizontalHeavyRuler } from '@libs/neumorphism-ui/components/HorizontalHeavyRuler';
import { TxReceipt, TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { AccessTime, Close, Done as DoneIcon } from '@material-ui/icons';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import React, { useCallback } from 'react';
import { GuardSpinner, PushSpinner } from 'react-spinners-kit';
import styled, { useTheme } from 'styled-components';
import { renderTxFailedReason } from './renderTxFailedReason';
import { Container } from 'components/primitives/Container';

export interface TxResultRendererProps {
  resultRendering: TxResultRendering;
  onExit?: () => void;
  onMinimize?: () => void;
  minimizable?: boolean;
}

export function TxResultRenderer({
  resultRendering,
  onExit,
  minimizable,
  onMinimize,
}: TxResultRendererProps) {
  const {
    dimTextColor,
    colors: { primary },
  } = useTheme();

  const {
    phase,
    message = 'Waiting for Terra Station...',
    description = 'Transaction broadcasted. There is no need to send another until it has been complete.',
    failedReason,
  } = resultRendering;

  const handleMinimize = useCallback(() => {
    onMinimize?.();
    onExit?.();
  }, [onExit, onMinimize]);

  switch (phase) {
    case TxStreamPhase.POST:
      return (
        <Layout>
          <article>
            <figure data-state={phase}>
              <PushSpinner color={dimTextColor} />
            </figure>

            <h2>{message}</h2>

            <Receipts resultRendering={resultRendering} />

            <SubmitButton onClick={() => onExit?.()}>Stop</SubmitButton>
          </article>
        </Layout>
      );
    case TxStreamPhase.BROADCAST:
      return (
        <Layout>
          <article>
            <figure data-state={phase}>
              <GuardSpinner frontColor={primary} />
            </figure>

            <h2>
              <span>{message}</span>
              <p>{description}</p>
            </h2>

            <Receipts resultRendering={resultRendering} />
            {minimizable && (
              <Container direction="row" gap={10}>
                <ActionButton
                  className="minimize-button"
                  onClick={handleMinimize}
                >
                  Minimize
                </ActionButton>
              </Container>
            )}
          </article>
        </Layout>
      );
    case TxStreamPhase.SUCCEED:
      return (
        <Layout>
          <article>
            <figure data-state={phase}>
              <DoneIcon />
            </figure>

            <h2>Complete!</h2>

            <Receipts resultRendering={resultRendering} />

            <SubmitButton onClick={() => onExit?.()}>OK</SubmitButton>
          </article>
        </Layout>
      );
    case TxStreamPhase.FAILED:
      return (
        <Layout>
          <article>
            {failedReason?.error instanceof PollingTimeout ? (
              <figure data-state={TxStreamPhase.SUCCEED}>
                <AccessTime />
              </figure>
            ) : (
              <figure data-state={phase}>
                <Close />
              </figure>
            )}

            {failedReason && renderTxFailedReason(failedReason)}

            <Receipts resultRendering={resultRendering} />

            <SubmitButton onClick={() => onExit?.()}>OK</SubmitButton>
          </article>
        </Layout>
      );
  }
}

function Receipts({ resultRendering }: { resultRendering: TxResultRendering }) {
  const filteredReceipts = resultRendering.receipts.filter(
    (receipt): receipt is TxReceipt => !!receipt,
  );

  return filteredReceipts.length > 0 ? (
    <>
      <HorizontalHeavyRuler />

      <TxFeeList showRuler={false}>
        {filteredReceipts.map((receipt, i) => {
          const name =
            typeof receipt.name === 'string' ? (
              receipt.name
            ) : (
              <span dangerouslySetInnerHTML={{ __html: receipt.name.html }} />
            );

          const value =
            typeof receipt.value === 'string' ? (
              receipt.value
            ) : (
              <span dangerouslySetInnerHTML={{ __html: receipt.value.html }} />
            );

          return (
            <TxFeeListItem key={'detail' + i} label={name}>
              {value}
            </TxFeeListItem>
          );
        })}
      </TxFeeList>
    </>
  ) : null;
}

const SubmitButton = styled(ActionButton)`
  height: 4.1em;
  width: 100%;
  margin-top: 2em;
`;

const Layout = styled.section`
  .minimize-button {
    margin-top: 20px;
    width: 100%;
    height: 60px;
    border-radius: 30px;
  }

  > article {
    div,
    p,
    pre {
      word-break: break-word;
      white-space: break-spaces;
    }

    ul {
      margin-top: 1em;
    }

    > figure:first-child {
      color: ${({ theme }) => theme.textColor};

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

      img {
        font-size: 7em;
        width: 1em;
        height: 1em;
        border-radius: 50%;
      }

      &[data-state='${TxStreamPhase.FAILED}'] {
        color: ${({ theme }) => theme.colors.negative};
      }

      &[data-state='${TxStreamPhase.SUCCEED}'] {
        color: ${({ theme }) => theme.colors.positive};
      }

      &[data-state='${TxStreamPhase.POST}'],
      &[data-state='${TxStreamPhase.BROADCAST}'] {
        height: 8em;
        border: none;
        transform: scale(1.3);
      }
    }

    > h2 {
      font-weight: 500;
      font-size: 1.3em;
      text-align: center;
      margin-top: 1em;
      margin-bottom: 1.2em;

      p {
        margin: 1em 0;
        font-weight: 500;
        font-size: 12px;
        color: ${({ theme }) => theme.dimTextColor};
      }
    }

    > hr {
      margin-bottom: 2em;
    }
  }

  > button:last-child {
    margin-top: 3em;
  }
`;
