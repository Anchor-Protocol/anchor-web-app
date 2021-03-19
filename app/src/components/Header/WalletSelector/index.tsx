import { useWallet, WalletStatusType } from '@anchor-protocol/wallet-provider';
import { ClickAwayListener } from '@material-ui/core';
import { useBank } from 'base/contexts/bank';
import { useAirdrop } from 'pages/airdrop/queries/useAirdrop';
import { useSendDialog } from 'pages/send/useSendDialog';
import { useCallback, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { AirdropDropdownContent } from './AirdropDropdownContent';
import { ConnectedButton } from './ConnectedButton';
import { DropdownContainer } from './DropdownContainer';
import { NotConnectedButton } from './NotConnectedButton';
import { WalletDetailContent } from './WalletDetailContent';

export interface WalletSelectorProps {
  className?: string;
}

function WalletSelectorBase({ className }: WalletSelectorProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  // TODO
  const { status, install, connect, disconnect } = useWallet();

  const bank = useBank();

  const [airdrop] = useAirdrop();

  const matchAirdrop = useRouteMatch('/airdrop');

  const [openSendDialog, sendDialogElement] = useSendDialog();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [open, setOpen] = useState(false);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const connectWallet = useCallback(() => {
    connect();
    setOpen(false);
  }, [connect]);

  const disconnectWallet = useCallback(() => {
    disconnect();
    window.location.reload();
  }, [disconnect]);

  const toggleOpen = useCallback(() => {
    if (
      status.status === WalletStatusType.CONNECTED ||
      status.status === WalletStatusType.MANUAL_PROVIDED
    ) {
      setOpen((prev) => !prev);
    }
  }, [status.status]);

  const onClickAway = useCallback(() => {
    setOpen(false);
  }, []);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  switch (status.status) {
    case WalletStatusType.INITIALIZING:
      return (
        <div className={className}>
          <NotConnectedButton disabled>
            Initialzing Wallet...
          </NotConnectedButton>
        </div>
      );
    case WalletStatusType.NOT_CONNECTED:
      return (
        <div className={className}>
          <NotConnectedButton onClick={connectWallet}>
            Connect Wallet
          </NotConnectedButton>
        </div>
      );
    case WalletStatusType.CONNECTED:
    case WalletStatusType.MANUAL_PROVIDED:
      return (
        <ClickAwayListener onClickAway={onClickAway}>
          <div className={className}>
            <ConnectedButton status={status} bank={bank} onClick={toggleOpen} />

            {status.status === WalletStatusType.CONNECTED &&
              airdrop &&
              airdrop !== 'in-progress' &&
              !open &&
              !matchAirdrop && (
                <DropdownContainer>
                  <AirdropDropdownContent />
                </DropdownContainer>
              )}

            {open && (
              <DropdownContainer>
                <WalletDetailContent
                  bank={bank}
                  status={status}
                  closePopup={() => setOpen(false)}
                  disconnectWallet={disconnectWallet}
                  openSend={() => openSendDialog({})}
                />
              </DropdownContainer>
            )}

            {sendDialogElement}
          </div>
        </ClickAwayListener>
      );
    case WalletStatusType.NOT_INSTALLED:
      return (
        <NotConnectedButton className={className} onClick={install}>
          Please Install Wallet
        </NotConnectedButton>
      );
    default:
      return null;
  }
}

export const WalletSelector = styled(WalletSelectorBase)`
  display: inline-block;
  position: relative;
  text-align: left;
`;
