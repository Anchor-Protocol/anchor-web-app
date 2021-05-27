import { Close, Done as DoneIcon } from '@material-ui/icons';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { HorizontalHeavyRuler } from '@terra-dev/neumorphism-ui/components/HorizontalHeavyRuler';
import {
  TxReceipt,
  TxResultRendering,
  TxStreamPhase,
} from '@terra-money/webapp-fns';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import React from 'react';
import { GuardSpinner, PushSpinner } from 'react-spinners-kit';
import styled, { useTheme } from 'styled-components';
import { renderTxFailedReason } from './renderTxFailedReason';

export interface TxResultRendererProps {
  resultRendering: TxResultRendering;
  onExit: () => void;
}

export function TxResultRenderer({
  resultRendering,
  onExit,
}: TxResultRendererProps) {
  const { dimTextColor } = useTheme();

  switch (resultRendering.phase) {
    case TxStreamPhase.POST:
      return (
        <Layout>
          <article>
            <figure data-state={resultRendering.phase}>
              <PushSpinner color={dimTextColor} />
            </figure>

            <h2>Waiting for Terra Station...</h2>

            <Receipts resultRendering={resultRendering} />

            <SubmitButton onClick={() => onExit?.()}>Stop</SubmitButton>
          </article>
        </Layout>
      );
    case TxStreamPhase.BROADCAST:
      return (
        <Layout>
          <article>
            <figure data-state={resultRendering.phase}>
              <GuardSpinner />
            </figure>

            <h2>Waiting for receipt...</h2>

            <Receipts resultRendering={resultRendering} />
          </article>
        </Layout>
      );
    case TxStreamPhase.SUCCEED:
      return (
        <Layout>
          <article>
            <figure data-state={resultRendering.phase}>
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
            <figure data-state={resultRendering.phase}>
              <Close />
            </figure>

            {resultRendering.failedReason &&
              renderTxFailedReason(resultRendering.failedReason)}

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
    }

    > hr {
      margin-bottom: 2em;
    }
  }

  > button:last-child {
    margin-top: 3em;
  }
`;
