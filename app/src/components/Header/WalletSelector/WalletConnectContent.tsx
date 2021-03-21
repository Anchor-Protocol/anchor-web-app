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
      <h2>Connect Wallet</h2>

      {status.status === WalletStatusType.NOT_CONNECTED && (
        <>
          <p>
            You seems installed Chrome Extension.
            <br />
            You can connect your Terra Station Wallet.
          </p>

          <FlatButton
            onClick={() => {
              connectWallet();
              closePopup();
            }}
          >
            Chrome Extension
          </FlatButton>
        </>
      )}

      {status.status === WalletStatusType.NOT_INSTALLED && (
        <>
          <p>
            If you want to send transaction.
            <br />
            Please install Chrome Extension.
          </p>
          <FlatButton
            onClick={() => {
              installWallet();
              closePopup();
            }}
          >
            Install Wallet
          </FlatButton>
        </>
      )}

      <p>
        You can connect your wallet address.
        <br />
        But, you can't send transaction.
      </p>

      <FlatButton
        onClick={() => {
          provideWallet();
          closePopup();
        }}
      >
        with Wallet Address
      </FlatButton>

      {walletHistory.length > 0 && (
        <>
          <h3>Recent Addresses</h3>
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
        </>
      )}
    </div>
  );
}

export const WalletConnectContent = styled(WalletConnectContentBase)`
  margin: 30px;

  h2 {
    text-align: center;

    font-size: 18px;
    font-weight: 500;
  }

  p {
    margin: 25px 0 15px 0;

    font-size: 14px;

    color: ${({ theme }) => theme.dimTextColor};
  }

  button {
    width: 100%;
    height: 28px;
  }

  h3 {
    margin-top: 30px;

    font-size: 16px;
    font-weight: 500;
  }

  ul {
    margin-top: 10px;

    list-style: none;
    padding: 0;

    li {
      cursor: pointer;
      text-decoration: underline;

      font-size: 14px;
    }
  }
`;
