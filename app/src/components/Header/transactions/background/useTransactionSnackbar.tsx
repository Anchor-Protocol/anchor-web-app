import { truncateEvm } from '@libs/formatter';
import { HorizontalHeavyRuler } from '@libs/neumorphism-ui/components/HorizontalHeavyRuler';
import { SnackbarContent } from '@libs/neumorphism-ui/components/Snackbar';
import { Snackbar, useSnackbar } from '@libs/snackbar';
import { Done as DoneIcon } from '@material-ui/icons';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
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
    <Snackbar className={className}>
      <SnackbarContent
        classes={{
          root: 'snackbar-root',
          message: 'snackbar-message',
        }}
        message={<TxMessage tx={tx} />}
      />
    </Snackbar>
  );
};

export const TxSnackbar = styled(TxSnackbarBase)`
  .snackbar-root {
    background: #f6f6f7;
    box-shadow: -1px -1px 0px #ffffff, 1px 1px 1px #dbdbdb;
    border-radius: 20px;
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
      <figure className="icon">
        <DoneIcon />
      </figure>
      <h2>Complete!</h2>
      <HorizontalHeavyRuler />
      <TxFeeList showRuler={false}>
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
  display: flex;
  flex-direction: column;
  xcolor: ${({ theme }) => theme.dimTextColor};
  width: 100%;

  .icon {
    color: ${({ theme }) => theme.colors.positive};

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

  h2 {
    color: ${({ theme }) => theme.textColor};
    width: 100%;
    font-weight: 500;
    font-size: 1.3em;
    text-align: center;
    margin-top: 1em;
    margin-bottom: 1.2em;
  }
`;
