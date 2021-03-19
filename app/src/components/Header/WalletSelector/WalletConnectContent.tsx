import { truncate } from '@anchor-protocol/notation';
import { HumanAddr } from '@anchor-protocol/types';
import {
  WalletNotReady,
  WalletStatusType,
} from '@anchor-protocol/wallet-provider';
import { FlatButton } from '@terra-dev/neumorphism-ui/components/FlatButton';
import { useLocalStorageJson } from '@terra-dev/use-local-storage';
import {
  WalletHistory,
  walletHistoryKey,
} from 'components/Header/WalletSelector/types';
import styled from 'styled-components';

export interface WalletConnectContentProps {
  className?: string;
  status: WalletNotReady;
  installWallet: () => void;
  connectWallet: () => void;
  closePopup: () => void;
  provideWallet: (walletAddress?: HumanAddr) => void;
}

function WalletConnectContentBase({
  className,
  status,
  closePopup,
  installWallet,
  connectWallet,
  provideWallet,
}: WalletConnectContentProps) {
  const [{ walletHistory }] = useLocalStorageJson<WalletHistory>(
    walletHistoryKey,
    () => ({ walletHistory: [] }),
  );

  return (
    <div className={className}>
      {status.status === WalletStatusType.NOT_CONNECTED && (
        <FlatButton
          onClick={() => {
            connectWallet();
            closePopup();
          }}
        >
          Connect Wallet
        </FlatButton>
      )}

      {status.status === WalletStatusType.NOT_INSTALLED && (
        <FlatButton
          onClick={() => {
            installWallet();
            closePopup();
          }}
        >
          Install Wallet
        </FlatButton>
      )}

      <FlatButton
        onClick={() => {
          provideWallet();
          closePopup();
        }}
      >
        Provide Address
      </FlatButton>

      {walletHistory.length > 0 && (
        <ul>
          {walletHistory.map((walletAddress) => (
            <li
              key={walletAddress}
              onClick={() => {
                provideWallet(walletAddress);
                closePopup();
              }}
            >
              {truncate(walletAddress)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const WalletConnectContent = styled(WalletConnectContentBase)`
  margin: 30px;
  text-align: center;

  button {
    width: 100%;
    height: 28px;

    &:not(:first-child) {
      margin-top: 20px;
    }
  }

  ul {
    margin-top: 20px;

    list-style: none;
    padding: 0;

    li {
      cursor: pointer;
      text-decoration: underline;
    }
  }
`;
