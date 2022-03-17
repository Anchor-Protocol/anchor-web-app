import { buttonBaseStyle } from '@libs/neumorphism-ui/components/ActionButton';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import { Modal } from '@material-ui/core';
import React, { ReactNode, useCallback } from 'react';
import styled from 'styled-components';
import { useAccount } from 'contexts/account';
import { Content } from '../../wallet/evm/Content';
import { useEvmWallet } from '@libs/evm-wallet';
import { ConnectionList } from 'components/Header/wallet/evm/ConnectionList';

// TODO: see if this can be merged with useWalletDialog on the Terra side

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useWalletDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase(props: DialogProps<FormParams, FormReturn>) {
  const { className, closeDialog } = props;
  const { actions, connection } = useEvmWallet();
  const { connected, terraWalletAddress } = useAccount();

  const disconnectWallet = useCallback(() => {
    actions.deactivate();
    closeDialog();
  }, [closeDialog, actions]);

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        {connected && connection ? (
          <Content
            walletAddress={terraWalletAddress!}
            connection={connection}
            onClose={closeDialog}
            onDisconnectWallet={disconnectWallet}
          />
        ) : (
          <ConnectionList onClose={closeDialog} />
        )}
      </Dialog>
    </Modal>
  );
}

const Component = styled(ComponentBase)`
  width: 720px;

  section {
    padding: 0;
  }

  .wallet-address {
    display: inline-block;
  }

  .copy-wallet-address {
    display: inline-block;
    margin-left: 10px;
  }

  .wallet-icon {
    display: none !important;
  }

  ul {
    margin-top: 20px !important;
    font-size: 15px !important;
  }

  .disconnect {
    margin-top: 40px;

    width: 100%;
    height: 40px !important;

    ${buttonBaseStyle};

    background-color: ${({ theme }) => theme.actionButton.backgroundColor};

    &:hover {
      background-color: ${({ theme }) =>
        theme.actionButton.backgroundHoverColor};
    }
  }
`;
