import {
  useConnectedWallet,
  useWallet,
} from '@anchor-protocol/wallet-provider2';
import { Modal } from '@material-ui/core';
import { buttonBaseStyle } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { Dialog } from '@terra-dev/neumorphism-ui/components/Dialog';
import { DialogProps, OpenDialog, useDialog } from '@terra-dev/use-dialog';
import { useBank } from 'base/contexts/bank';
import React, { ReactNode, useCallback } from 'react';
import styled from 'styled-components';
import { WalletDetailContent } from './WalletDetailContent';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useWalletDetailDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  const { disconnect } = useWallet();
  const connectedWallet = useConnectedWallet();

  const bank = useBank();

  const disconnectWallet = useCallback(() => {
    disconnect();
    window.location.reload();
  }, [disconnect]);

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        {!!connectedWallet && (
          <WalletDetailContent
            walletAddress={connectedWallet.walletAddress}
            network={connectedWallet.network}
            closePopup={() => {}}
            disconnectWallet={disconnectWallet}
            bank={bank}
            openSend={() => {}}
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
    height: 60px !important;

    ${buttonBaseStyle};

    background-color: ${({ theme }) => theme.actionButton.backgroundColor};

    &:hover {
      background-color: ${({ theme }) =>
        theme.actionButton.backgroundHoverColor};
    }
  }
`;
