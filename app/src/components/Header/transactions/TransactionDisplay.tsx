import React from 'react';
import { UIElementProps } from '@libs/ui';
import styled, { useTheme } from 'styled-components';
import { formatDistance } from 'date-fns';
import { truncateEvm } from '@libs/formatter';
import { Transaction } from 'tx/evm/storage/useTransactions';
import { formatTxKind, txResultMessage } from 'tx/evm/utils';
import useClipboard from 'react-use-clipboard';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { Check } from '@material-ui/icons';
import { useResumeBackgroundTx } from './background/useResumeBackgroundTx';
import { useEvmWallet } from '@libs/evm-wallet';
import { CircleSpinner } from 'react-spinners-kit';

interface TransactionDisplayProps extends UIElementProps {
  tx: Transaction;
}

function TransactionDisplayBase(props: TransactionDisplayProps) {
  const { className, tx } = props;

  const [isCopied, setCopied] = useClipboard(tx.receipt.transactionHash, {
    successDuration: 2000,
  });

  useResumeBackgroundTx(tx);
  const { connectType, chainId } = useEvmWallet();
  const theme = useTheme();

  return (
    <div className={className} key={tx.receipt.transactionHash}>
      <div className="details">
        <span className="action">{formatTxKind(tx.display.txKind)}</span>
        <span className="tx-hash" onClick={setCopied}>
          <IconSpan className="copy">{isCopied && <Check />}</IconSpan>
          <span className="hash">
            {truncateEvm(tx.receipt.transactionHash)}
          </span>
          <CircleSpinner size={8} color={theme.colors.secondary} />
        </span>
      </div>

      <div className="more-details">
        <div className="amount">{tx.display.amount ?? 'Unknown'}</div>
        <div className="timestamp">
          {formatDistance(tx.display.timestamp, new Date(), {
            addSuffix: true,
          })}
        </div>
      </div>
      <div className="tx-message">
        {txResultMessage(
          tx.lastEventKind,
          connectType!,
          chainId!,
          tx.display.txKind,
        )}
      </div>
    </div>
  );
}

export const TransactionDisplay = styled(TransactionDisplayBase)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: 500;
  font-size: 10px;
  margin: 10px;
  width: 300px;

  .tx-hash {
    cursor: pointer;
    display: flex;
    align-items: center;

    .copy {
      margin-right: 5px;
    }

    .hash {
      margin-right: 5px;
    }
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
    font-size: 12px;
    width: auto;
    height: 20px;
    line-height: 20px;
  }

  .details {
    display: flex;
    width: 100%;
    margin-bottom: 2px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .more-details {
    width: 100%;
    color: ${({ theme }) => theme.dimTextColor};
    display: flex;
  }

  .timestamp {
    margin-left: auto;
  }
`;
