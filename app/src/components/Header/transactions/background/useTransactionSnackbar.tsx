import { formatEllapsedSimple, truncateEvm } from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { SnackbarContent } from '@libs/neumorphism-ui/components/Snackbar';
import { Snackbar, useSnackbar } from '@libs/snackbar';
import { LinearProgress } from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { differenceInSeconds } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Transaction, useTransactions } from 'tx/evm/storage/useTransactions';
import { formatTxKind } from 'tx/evm/utils';

export const useTransactionSnackbar = () => {
  const { addSnackbar } = useSnackbar();
  const { getTransaction } = useTransactions();

  const add = useCallback(
    (txHash: string) => {
      if (!txHash) {
        return undefined;
      }

      const tx = getTransaction(txHash);

      const snackbarControl = addSnackbar(
        <TxSnackbar key={tx.txHash} tx={tx} />,
      );

      return function cleanup() {
        snackbarControl?.close();
      };
    },
    [addSnackbar, getTransaction],
  );

  return useMemo(() => ({ add }), [add]);
};

const TxSnackbarBase = ({
  className,
  tx,
  onClose,
}: {
  className?: string;
  tx: Transaction;
  onClose?: () => void;
}) => {
  // TODO: onClose should be provided by SnackbarProvider, and close after autoClose period,
  // but it doesn't work atm, or autoClose is just bugged
  const [hidden, setHidden] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setHidden(true);
    }, 5000);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hidden) {
    return null;
  }

  return (
    <Snackbar>
      <div className={className}>
        <LinearProgress className="tx-progress" />
        <SnackbarContent message={<TxMessage tx={tx} />} />
      </div>
    </Snackbar>
  );
};

const TxSnackbar = styled(TxSnackbarBase)`
  display: flex;
  flex-direction: column;

  .MuiSnackbarContent-action {
    padding-left: 0px;
  }

  .MuiSnackbarContent-message {
    width: 100%;
  }

  .MuiSnackbarContent-root {
    background-color: ${({ theme }) => theme.textColor};
  }

  .tx-progress {
    transform: translateY(4px);
    border-radius: 5px;
    background-color: inherit;

    .MuiLinearProgress-barColorPrimary {
      background-color: green;
    }
  }
`;

const TxMessageBase = ({
  className,
  tx,
}: {
  className?: string;
  tx: Transaction;
}) => {
  return (
    <div className={className}>
      <div className="tx-content">
        <div className="details">
          <span className="action">{formatTxKind(tx.display.txKind)}</span>
          <div className="amount">{tx.display.amount ?? 'Unknown'}</div>
        </div>
        <div className="more-details">
          <span className="tx-hash">
            <span className="hash">{truncateEvm(tx.txHash)}</span>
          </span>
          <div className="timestamp">
            {formatEllapsedSimple(
              differenceInSeconds(new Date(), tx.display.timestamp) * 1000,
            )}
          </div>
        </div>
        <div className="tx-message">
          <span>Transaction completed!</span>
          <IconSpan className="success-check">
            <Check />
          </IconSpan>
        </div>
      </div>
    </div>
  );
};

const TxMessage = styled(TxMessageBase)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: 500;
  font-size: 10px;
  color: ${({ theme }) => theme.dimTextColor};

  .tx-hash {
    cursor: pointer;
    display: flex;
    align-items: center;

    .hash {
      margin-right: 5px;
      text-decoration: underline;
      font-size: 12px;
      color: #fff;
    }
  }

  .success-check {
    color: green;
    margin-left: 5px;

    > .MuiSvgIcon-root {
      font-size: 14px;
      margin-right: auto;
    }
  }

  .amount {
    font-size: 12px;
  }

  .tx-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .tx-message {
    align-self: flex-start;
    font-size: 10px;
    max-width: 300px;
    font-weight: 500;
    text-transform: uppercase;
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
    display: flex;
  }

  .timestamp {
    margin-left: auto;
    font-size: 12px;
    font-weight: 400;
  }

  .action {
    text-transform: capitalize;
    font-size: 12px;
    width: auto;
    margin-right: auto;
  }
`;
