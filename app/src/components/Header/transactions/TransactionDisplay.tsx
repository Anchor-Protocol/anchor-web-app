import React, { useEffect } from 'react';
import { UIElementProps } from '@libs/ui';
import styled from 'styled-components';
import { differenceInSeconds } from 'date-fns';
import { formatEllapsedSimple, truncateEvm } from '@libs/formatter';
import { Transaction } from 'tx/evm/storage/useTransactions';
import { formatTxKind, TxKind } from 'tx/evm/utils';
import useClipboard from 'react-use-clipboard';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { Check } from '@material-ui/icons';
import { useResumeBackgroundTx } from './background/useResumeBackgroundTx';
import { CrossChainEventKind } from '@anchor-protocol/crossanchor-sdk';
import { useCountdown } from 'usehooks-ts';
import { TransactionProgress } from './TransactionProgress';

interface TransactionDisplayProps extends UIElementProps {
  tx: Transaction;
}

const ONE_WAY_TX_STEPS =
  CrossChainEventKind.OutgoingSequenceRetrieved.valueOf();
const TWO_WAY_TX_STEPS = CrossChainEventKind.CrossChainTxCompleted.valueOf();

const txStepCount = (tx: Transaction) => {
  switch (tx.display.txKind) {
    case TxKind.BorrowUst:
    case TxKind.DepositUst:
    case TxKind.RedeemCollateral:
    case TxKind.WithdrawAssets:
    case TxKind.WithdrawUst:
      return TWO_WAY_TX_STEPS;
    default:
      return ONE_WAY_TX_STEPS;
  }
};

function TransactionDisplayBase(props: TransactionDisplayProps) {
  const { className, tx } = props;

  const [isCopied, setCopied] = useClipboard(tx.txHash, {
    successDuration: 2000,
  });

  const [countdown, { start, stop }] = useCountdown({
    seconds: differenceInSeconds(new Date(), tx.display.timestamp),
    interval: 1000,
    isIncrement: true,
  });

  useEffect(() => {
    start();

    return () => {
      stop();
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useResumeBackgroundTx(tx);
  return (
    <div className={className} key={tx.txHash}>
      <div className="details">
        <span className="action">{formatTxKind(tx.display.txKind)}</span>
        <div className="amount">{tx.display.amount ?? 'Unknown'}</div>
      </div>

      <div className="more-details">
        <span className="tx-hash" onClick={setCopied}>
          <span className="hash">{truncateEvm(tx.txHash)}</span>
          {isCopied && (
            <IconSpan className="copy">
              <Check /> Copied
            </IconSpan>
          )}
        </span>
        <div className="timestamp">
          {formatEllapsedSimple(countdown * 1000)}
        </div>
      </div>

      <TransactionProgress
        stepCount={txStepCount(tx)}
        currStep={tx.lastEventKind}
      />
    </div>
  );
}

export const TransactionDisplay = styled(TransactionDisplayBase)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: 500;
  font-size: 10px;
  margin-bottom: 20px;

  .tx-hash {
    cursor: pointer;
    display: flex;
    align-items: center;

    .copy {
      > .MuiSvgIcon-root {
        font-size: 12px;
        margin-right: -2px;
      }

      padding: 0px 5px;
      text-transform: uppercase;
      border: 0;
      outline: none;
      border-radius: 12px;

      background-color: ${({ theme }) =>
        theme.palette.type === 'light' ? '#f1f1f1' : 'rgba(0, 0, 0, 0.15)'};
      color: ${({ theme }) => theme.dimTextColor};
    }

    .hash {
      margin-right: 5px;
      text-decoration: underline;
      font-size: 12px;
      color: ${({ theme }) => theme.textColor};
    }
  }

  .amount {
    font-size: 12px;
  }

  .tx-message {
    margin-top: 5px;
    align-self: flex-start;
    font-size: 10px;
    max-width: 300px;
    color: ${({ theme }) => theme.colors.secondary};
  }

  .button {
    background-color: ${({ theme }) =>
      theme.palette.type === 'light' ? '#f4f4f5' : '#2a2a46'};
    color: ${({ theme }) => theme.textColor};
  }

  .action {
    text-transform: capitalize;
    font-size: 12px;
    width: auto;
  }

  .details {
    display: flex;
    width: 100%;
    margin-bottom: 5px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .more-details {
    margin-bottom: 5px;
    width: 100%;
    color: ${({ theme }) => theme.dimTextColor};
    display: flex;
  }

  .timestamp {
    margin-left: auto;
    font-size: 12px;
    font-weight: 400;
  }
`;
