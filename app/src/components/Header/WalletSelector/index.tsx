import { useWallet, WalletStatusType } from '@anchor-protocol/wallet-provider';
import { ClickAwayListener } from '@material-ui/core';
import { useIsDesktopChrome } from '@terra-dev/is-desktop-chrome';
import { usePeriodMessage } from '@terra-dev/use-period-message';
import { useBank } from 'base/contexts/bank';
import { AirdropContent } from 'components/Header/WalletSelector/AirdropContent';
import { AnnouncementContent } from 'components/Header/WalletSelector/AnnouncementContent';
import { useViewAddressDialog } from 'components/Header/WalletSelector/useViewAddressDialog';
import { useAirdrop } from 'pages/airdrop/queries/useAirdrop';
import { BurnUserAnnouncementContent } from 'pages/announcement/components/BurnUserAnnouncementContent';
import { MintUserAnnouncementContent } from 'pages/announcement/components/MintUserAnnouncementContent';
import { useIsBurnUser } from 'pages/announcement/data/useIsBurnUser';
import { useIsMintUser } from 'pages/announcement/data/useIsMintUser';
import { useSendDialog } from 'pages/send/useSendDialog';
import { useCallback, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { ConnectedButton } from './ConnectedButton';
import { DropdownBox, DropdownContainer } from './DropdownContainer';
import { NotConnectedButton } from './NotConnectedButton';
import { WalletDetailContent } from './WalletDetailContent';

export interface WalletSelectorProps {
  className?: string;
}

let _airdropClosed: boolean = false;

function WalletSelectorBase({ className }: WalletSelectorProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, install, connect, disconnect } = useWallet();

  const announcementBurnUser = useIsBurnUser();

  const announcementMintUser = useIsMintUser();

  const isDesktopChrome = useIsDesktopChrome();

  const bank = useBank();

  const [airdrop] = useAirdrop();

  const matchAirdrop = useRouteMatch('/airdrop');

  const [openSendDialog, sendDialogElement] = useSendDialog();

  const [openViewAddress, viewAddressElement] = useViewAddressDialog();

  const [airdropClosed, setAirdropClosed] = useState(() => _airdropClosed);

  const [announcementClosed, closeAnnouncement] = usePeriodMessage({
    id: 'announcement',
    period: 1000 * 60 * 60 * 8,
  });

  const closeAirdrop = useCallback(() => {
    setAirdropClosed(true);
    _airdropClosed = true;
  }, []);

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

  //const provideWallet = useCallback(
  //  (address?: HumanAddr) => {
  //    if (address) {
  //      connectWalletAddress(address);
  //    } else {
  //      openProvideAddress({});
  //    }
  //  },
  //  [openProvideAddress, connectWalletAddress],
  //);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

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
    case WalletStatusType.NOT_INSTALLED:
    case WalletStatusType.UNAVAILABLE:
      if (isDesktopChrome) {
        if (status.status === WalletStatusType.NOT_CONNECTED) {
          return (
            <div className={className}>
              <NotConnectedButton onClick={connectWallet}>
                Connect Wallet
              </NotConnectedButton>
            </div>
          );
        } else if (status.status === WalletStatusType.NOT_INSTALLED) {
          return (
            <div className={className}>
              <NotConnectedButton onClick={install}>
                Please Install Wallet
              </NotConnectedButton>
            </div>
          );
        }
      }

      return (
        <div className={className}>
          <NotConnectedButton onClick={() => openViewAddress({})}>
            View an address
          </NotConnectedButton>
          {viewAddressElement}
        </div>
      );

    //return (
    //  <ClickAwayListener onClickAway={onClickAway}>
    //    <div className={className}>
    //      <NotConnectedButton onClick={toggleOpen}>
    //        Connect Wallet
    //      </NotConnectedButton>
    //
    //      {open && (
    //        <DropdownContainer>
    //          <WalletConnectContent
    //            status={status}
    //            closePopup={() => setOpen(false)}
    //            installWallet={install}
    //            provideWallet={provideWallet}
    //            connectWallet={connectWallet}
    //          />
    //        </DropdownContainer>
    //      )}
    //
    //      {provideAddressElement}
    //    </div>
    //  </ClickAwayListener>
    //);
    case WalletStatusType.CONNECTED:
    case WalletStatusType.WALLET_ADDRESS_CONNECTED:
      return (
        <ClickAwayListener onClickAway={onClickAway}>
          <div className={className}>
            <ConnectedButton status={status} bank={bank} onClick={toggleOpen} />

            <DropdownContainer>
              {!airdropClosed &&
                status.status === WalletStatusType.CONNECTED &&
                airdrop &&
                airdrop !== 'in-progress' &&
                !open &&
                !matchAirdrop && (
                  <DropdownBox>
                    <AirdropContent onClose={closeAirdrop} />
                  </DropdownBox>
                )}
              {(!!announcementBurnUser || !!announcementMintUser) &&
                !announcementClosed &&
                !open && (
                  <DropdownBox>
                    <AnnouncementContent onClose={closeAnnouncement}>
                      {announcementBurnUser && (
                        <BurnUserAnnouncementContent
                          {...announcementBurnUser}
                        />
                      )}
                      {announcementMintUser && (
                        <MintUserAnnouncementContent
                          {...announcementMintUser}
                        />
                      )}
                    </AnnouncementContent>
                  </DropdownBox>
                )}
            </DropdownContainer>

            {open && (
              <DropdownContainer>
                <DropdownBox>
                  <WalletDetailContent
                    bank={bank}
                    status={status}
                    closePopup={() => setOpen(false)}
                    disconnectWallet={disconnectWallet}
                    openSend={() => openSendDialog({})}
                  />
                </DropdownBox>
              </DropdownContainer>
            )}

            {sendDialogElement}
          </div>
        </ClickAwayListener>
      );
  }
}

export const WalletSelector = styled(WalletSelectorBase)`
  display: inline-block;
  position: relative;
  text-align: left;
`;
