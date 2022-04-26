import { truncateEvm } from '@libs/formatter';
import { SnackbarContent } from '@libs/neumorphism-ui/components/Snackbar';
import { Snackbar, useSnackbar } from '@libs/snackbar';
import { CircularProgress } from '@material-ui/core';
import { ReactComponent as CompleteIcon } from '../../../assets/Complete.svg';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Transaction, useTransactions } from 'tx/evm/storage/useTransactions';
import { formatTxKind } from 'tx/evm/utils';
import { pressed } from '@libs/styled-neumorphism';

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

  if (hidden) {
    return null;
  }

  return (
    <Snackbar className={className}>
      <div className="tx-snackbar-container">
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

const TxSnackbar = styled(TxSnackbarBase)`
  .tx-snackbar-container {
    display: flex;
    flex-direction: column;
  }

  .snackbar-root {
    background: #f7f7f7;
    box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.15);
    border-radius: 16px;
    padding: 26px 30px;
  }

  .snackbar-message {
    width: 100%;
  }
`;

interface TxMessageProps {
  className?: string;
  tx: Transaction;
}

const TxMessageBase = (props: TxMessageProps) => {
  const { className, tx } = props;

  const [countdown, setCountdown] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((v) => Math.max(0, v - 4));
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, [setCountdown]);

  return (
    <div className={className}>
      <header>
        <figure className="icon">
          <CompleteIcon width={49} height={49} />
        </figure>
        <CircularProgress
          className="progress"
          size={61}
          variant="determinate"
          value={-countdown}
        />
        <h2>Complete!</h2>
      </header>
      <hr />
      <TxFeeList showRuler={false} gutters="compact">
        <TxFeeListItem label={formatTxKind(tx.display.txKind)}>
          {tx.display.amount}
        </TxFeeListItem>
        <TxFeeListItem label={'Tx Hash'}>
          {truncateEvm(tx.txHash)}
        </TxFeeListItem>
      </TxFeeList>
    </div>
  );
};

const TxMessage = styled(TxMessageBase)`
  header {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .icon {
      color: ${({ theme }) => theme.colors.positive};
    }

    h2 {
      color: ${({ theme }) => theme.textColor};
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      text-align: center;
      margin-top: 10px;
    }

    .progress {
      color: ${({ theme }) => theme.colors.positive};
      position: absolute;
      top: -6px;
      z-index: 1;
    }
  }

  hr {
    margin: 20px 0;
    padding: 0;
    border: 0;
    height: 5px;
    border-radius: 3px;

    ${({ theme }) =>
      pressed({
        color: theme.sectionBackgroundColor,
        distance: 1,
        intensity: theme.intensity,
      })};
  }
`;
