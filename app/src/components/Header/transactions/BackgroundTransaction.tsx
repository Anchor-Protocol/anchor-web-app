import { SnackbarContent } from '@libs/neumorphism-ui/components/Snackbar';
import { Snackbar, useSnackbar } from '@libs/snackbar';
import { LinearProgress } from '@material-ui/core';
import { StreamResult, StreamStatus } from '@rx-stream/react';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { BackgroundTxRender, useBackgroundTx } from 'tx/evm';
import { Transaction } from 'tx/evm/storage/useTransactions';
import { TransactionDisplay } from './TransactionDisplay';

export type BackgroundTransactionProps = { tx: Transaction };

export const BackgroundTransaction = ({ tx }: BackgroundTransactionProps) => {
  const backgroundTx = useBackgroundTx(tx);
  const { addSnackbar } = useSnackbar();

  useEffect(() => {
    if (backgroundTx) {
      const [execute, txResult] = backgroundTx.stream;
      execute({});
      addSnackbar(<TxSnackbar tx={tx} txResult={txResult} />);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <React.Fragment />;
};

const TxSnackbarBase = ({
  txResult,
  className,
  tx,
}: {
  txResult: StreamResult<BackgroundTxRender>;
  className?: string;
  tx: Transaction;
}) => {
  return (
    <Snackbar autoClose={false}>
      <div className={className}>
        <LinearProgress className="tx-progress" />
        <SnackbarContent
          message={<TxMessage txResult={txResult} tx={tx} />}
          action={
            [
              //   <Button key="undo" color="inherit" size="small">
              //     UNDO
              //   </Button>,
              //   <IconButton key="close" aria-label="close" color="inherit">
              //     <Close />
              //   </IconButton>,
            ]
          }
        />
      </div>
    </Snackbar>
  );
};

const TxSnackbar = styled(TxSnackbarBase)`
  display: flex;
  flex-direction: column;

  .tx-progress {
    transform: translateY(4px);
    border-radius: 5px;
    background-color: inherit;

    .MuiLinearProgress-barColorPrimary {
      background-color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const TxMessageBase = ({
  txResult,
  className,
  tx,
}: {
  txResult: StreamResult<BackgroundTxRender>;
  className?: string;
  tx: Transaction;
}) => {
  return (
    <div className={className}>
      <div className="tx-content">
        <TransactionDisplay tx={tx} />
        <div className="tx-message">{txMessage(txResult)}</div>
      </div>
    </div>
  );
};

const TxMessage = styled(TxMessageBase)`
  .tx-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .tx-message {
    align-self: flex-start;
    font-size: 10px;
    margin-left: 10px;
  }
`;

const txMessage = (txResult: StreamResult<BackgroundTxRender>) => {
  if (
    txResult?.status === StreamStatus.IN_PROGRESS ||
    txResult?.status === StreamStatus.DONE
  ) {
    return (
      txResult.value.message ?? (txResult.value.failedReason?.error as string)
    );
  }

  return 'Processing transaction...';
};
