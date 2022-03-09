import { useEvmWallet } from '@libs/evm-wallet';
import { SnackbarContent } from '@libs/neumorphism-ui/components/Snackbar';
import { Snackbar, useSnackbar } from '@libs/snackbar';
import { LinearProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import styled from 'styled-components';
//import { useBackgroundTx } from 'tx/evm';
import { useTransaction } from 'tx/evm/storage/useTransaction';
import { Transaction } from 'tx/evm/storage/useTransactions';
import { txResultMessage } from 'tx/evm/utils';
import { TransactionDisplay } from './TransactionDisplay';

export type BackgroundTransactionProps = { tx: Transaction };

export const BackgroundTransaction = ({ tx }: BackgroundTransactionProps) => {
  const { addSnackbar } = useSnackbar();

  useEffect(
    () => {
      const snackbarControl = addSnackbar(
        <TxSnackbar txHash={tx.receipt.transactionHash} />,
      );
      return function cleanup() {
        snackbarControl?.close();
      };
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return <React.Fragment />;
};

const TxSnackbarBase = ({
  className,
  txHash,
}: {
  className?: string;
  txHash: string;
}) => {
  //const tx = useTransaction(txHash)!;
  //const backgroundTx = useBackgroundTx(tx);
  //const [execute] = backgroundTx?.stream ?? [null, null];

  useEffect(() => {
    // if (!tx.active) {
    //   execute!({});
    // }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Snackbar autoClose={false}>
      <div className={className}>
        <LinearProgress className="tx-progress" />
        <SnackbarContent
          message={<TxMessage txHash={txHash} />}
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
  className,
  txHash,
}: {
  className?: string;
  txHash: string;
}) => {
  const tx = useTransaction(txHash)!;
  const { connectType, chainId } = useEvmWallet();

  return (
    <div className={className}>
      <div className="tx-content">
        <TransactionDisplay tx={tx} />
        <div className="tx-message">
          {txResultMessage(
            tx.lastEventKind,
            connectType!,
            chainId!,
            tx.display.action,
          )}
        </div>
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
