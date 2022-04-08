import { truncateEvm } from '@libs/formatter';
import { SnackbarContent } from '@libs/neumorphism-ui/components/Snackbar';
import { Snackbar, useSnackbar } from '@libs/snackbar';
import { useInterval } from '@libs/use-interval';
import { LinearProgress } from '@material-ui/core';
import { Done as DoneIcon } from '@material-ui/icons';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Transaction, useTransactions } from 'tx/evm/storage/useTransactions';
import { formatTxKind } from 'tx/evm/utils';
import { useCounter } from 'usehooks-ts';

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
    }, 3000);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { setCount, count } = useCounter(100);

  useInterval(() => {
    if (count > 0) {
      setCount((count) => count - 5);
    }
  }, 125);

  if (hidden) {
    return null;
  }

  return (
    <Snackbar className={className}>
      <div className="tx-snackbar-container">
        <LinearProgress
          className="tx-progress"
          variant="determinate"
          value={count}
        />
        <SnackbarContent
          classes={{
            root: 'snackbar-root',
            message: 'snackbar-message',
          }}
          message={<TxMessage tx={tx} />}
        />
      </div>
    </Snackbar>
  );
};

export const TxSnackbar = styled(TxSnackbarBase)`
  .tx-snackbar-container {
    display: flex;
    flex-direction: column;
  }

  .tx-progress {
    width: 100%;
    margin: auto;
    transform: translateY(3px);
    border-radius: 20px;
    background-color: inherit;

    .MuiLinearProgress-barColorPrimary {
      background-color: ${({ theme }) => theme.colors.positive};
    }
  }

  .snackbar-root {
    background: #f6f6f7;
    box-shadow: -1px -1px 0px #ffffff, 1px 1px 1px #dbdbdb;
    border-radius: 5px;
  }

  .snackbar-message {
    width: 100%;
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
      <div className="tx-notification">
        <figure className="icon">
          <DoneIcon />
        </figure>
        <h2>Complete!</h2>
      </div>
      <div className="tx-display">
        <TxFeeList showRuler={false}>
          <TxFeeListItem label={formatTxKind(tx.display.txKind)}>
            {tx.display.amount}
          </TxFeeListItem>
          <TxFeeListItem label={'Tx Hash'}>
            {truncateEvm(tx.txHash)}
          </TxFeeListItem>
        </TxFeeList>
      </div>
    </div>
  );
};

const TxMessage = styled(TxMessageBase)`
  display: flex;
  flex-direction: row;
  xcolor: ${({ theme }) => theme.dimTextColor};
  width: 100%;
  align-items: center;

  .icon {
    color: ${({ theme }) => theme.colors.positive};

    margin: 0 auto;
    width: 3em;
    height: 3em;
    border-radius: 50%;
    border: 3px solid currentColor;
    display: grid;
    place-content: center;

    svg {
      font-size: 1.5em;
    }
  }

  .tx-notification {
    margin-right: 20px;
  }

  .tx-display {
    width: 220px;
  }

  h2 {
    color: ${({ theme }) => theme.textColor};
    width: 100%;
    font-weight: 500;
    font-size: 14px;
    text-align: center;
  }
`;
