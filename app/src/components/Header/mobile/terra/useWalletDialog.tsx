import { buttonBaseStyle } from '@libs/neumorphism-ui/components/ActionButton';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import { Modal } from '@material-ui/core';
import { useConnectedWallet, useWallet } from '@terra-money/wallet-provider';
import React, { ReactNode, useCallback } from 'react';
import styled from 'styled-components';
import { useAccount } from 'contexts/account';
import { Content } from '../../wallet/terra/Content';

interface FormParams {
  className?: string;
  openSend: () => void;
  openBuyUst: () => void;
}

type FormReturn = void;

export function useWalletDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase(props: DialogProps<FormParams, FormReturn>) {
  const { className, closeDialog, openSend, openBuyUst } = props;
  const { disconnect } = useWallet();
  const { connected, terraWalletAddress } = useAccount();
  const connectedWallet = useConnectedWallet();

  const disconnectWallet = useCallback(() => {
    disconnect();
    closeDialog();
    //window.location.reload();
  }, [closeDialog, disconnect]);

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        {connected && !!connectedWallet && (
          <Content
            walletAddress={terraWalletAddress!}
            connection={connectedWallet.connection}
            onClose={closeDialog}
            onDisconnectWallet={disconnectWallet}
            onSend={openSend}
            onBuyUST={openBuyUst}
          />
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
