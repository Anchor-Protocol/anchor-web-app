import { Close, Done as DoneIcon } from '@material-ui/icons';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { HorizontalHeavyRuler } from '@terra-dev/neumorphism-ui/components/HorizontalHeavyRuler';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxReceipt, TxRender, TxStreamPhase } from 'models/tx';
import React from 'react';
import { GuardSpinner, PushSpinner } from 'react-spinners-kit';
import styled, { useTheme } from 'styled-components';

export interface TxRendererProps {
  txRender: TxRender;
  onExit: () => void;
}

export function TxRenderer({ txRender, onExit }: TxRendererProps) {
  const { dimTextColor } = useTheme();

  switch (txRender.phase) {
    case TxStreamPhase.POST:
      return (
        <Layout>
          <article>
            <figure data-state={txRender.phase}>
              <PushSpinner color={dimTextColor} />
            </figure>

            <h2>Waiting for Terra Station...</h2>

            <Receipts txRender={txRender} />

            <SubmitButton onClick={() => onExit?.()}>Stop</SubmitButton>
          </article>
        </Layout>
      );
    case TxStreamPhase.BROADCAST:
      return (
        <Layout>
          <article>
            <figure data-state={txRender.phase}>
              <GuardSpinner />
            </figure>

            <h2>Waiting for receipt...</h2>

            <Receipts txRender={txRender} />
          </article>
        </Layout>
      );
    case TxStreamPhase.SUCCEED:
      return (
        <Layout>
          <article>
            <figure data-state={txRender.phase}>
              <DoneIcon />
            </figure>

            <h2>Complete!</h2>

            <Receipts txRender={txRender} />

            <SubmitButton onClick={() => onExit?.()}>OK</SubmitButton>
          </article>
        </Layout>
      );
    case TxStreamPhase.FAILED:
      return (
        <Layout>
          <article>
            <figure data-state={txRender.phase}>
              <Close />
            </figure>

            {txRender.failedReason && (
              <>
                <h2>{txRender.failedReason.title}</h2>
                {txRender.failedReason.contents}
              </>
            )}

            <Receipts txRender={txRender} />

            <SubmitButton onClick={() => onExit?.()}>OK</SubmitButton>
          </article>
        </Layout>
      );
  }
}

function Receipts({ txRender }: { txRender: TxRender }) {
  const filteredReceipts = txRender.receipts.filter(
    (receipt): receipt is TxReceipt => !!receipt,
  );

  return filteredReceipts.length > 0 ? (
    <>
      <HorizontalHeavyRuler />

      <TxFeeList showRuler={false}>
        {filteredReceipts.map(({ name, value }, i) => (
          <TxFeeListItem key={'detail' + i} label={name}>
            {value}
          </TxFeeListItem>
        ))}
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

      &[data-state='${TxStreamPhase.FAILED}'] {
        color: ${({ theme }) => theme.colors.negative};
      }

      &[data-state='${TxStreamPhase.SUCCEED}'] {
        color: ${({ theme }) => theme.colors.positive};
      }

      &[data-state='${TxStreamPhase.POST}'],
      &[data-state='${TxStreamPhase.BROADCAST}'] {
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
