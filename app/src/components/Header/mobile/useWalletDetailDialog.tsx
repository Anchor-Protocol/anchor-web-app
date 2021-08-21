import { Modal } from '@material-ui/core';
import { buttonBaseStyle } from '@packages/neumorphism-ui/components/ActionButton';
import { Dialog } from '@packages/neumorphism-ui/components/Dialog';
import { DialogProps, OpenDialog, useDialog } from '@packages/use-dialog';
import { useConnectedWallet, useWallet } from '@terra-money/wallet-provider';
import { useBank } from 'contexts/bank';
import React, { ReactNode, useCallback } from 'react';
import styled from 'styled-components';
import { WalletDetailContent } from '../wallet/WalletDetailContent';

interface FormParams {
  className?: string;
  openSend: () => void;
  openBuyUst: () => void;
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
  openSend,
  openBuyUst,
}: DialogProps<FormParams, FormReturn>) {
  const { disconnect } = useWallet();
  const connectedWallet = useConnectedWallet();

  const bank = useBank();

  const disconnectWallet = useCallback(() => {
    disconnect();
    closeDialog();
    //window.location.reload();
  }, [closeDialog, disconnect]);

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        {!!connectedWallet && (
          <WalletDetailContent
            connectType={connectedWallet.connectType}
            availablePost={connectedWallet.availablePost}
            walletAddress={connectedWallet.walletAddress}
            network={connectedWallet.network}
            closePopup={closeDialog}
            disconnectWallet={disconnectWallet}
            bank={bank}
            openSend={openSend}
            openBuyUst={openBuyUst}
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
