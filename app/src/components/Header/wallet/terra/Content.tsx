import React, { useCallback } from 'react';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { ConnectType, Connection } from '@terra-money/wallet-provider';
import { useAccount } from 'contexts/account';
import { WalletContent } from '../WalletContent';
import { KeyboardArrowRight, Launch } from '@material-ui/icons';
import { UIElementProps } from '@libs/ui';
import { HumanAddr } from '@libs/types';
import styled from 'styled-components';
import { useNetwork } from '@anchor-protocol/app-provider';
import { TokenList } from '../TokenList';

type Action = () => void;

interface ContentProps extends UIElementProps {
  walletAddress: HumanAddr;
  connection: Connection;
  onClose: Action;
  onDisconnectWallet: Action;
  onSend: Action;
  onBuyUST: Action;
}

const ContentBase = (props: ContentProps) => {
  const {
    className,
    walletAddress,
    connection,
    onClose,
    onDisconnectWallet,
    onSend,
    onBuyUST,
  } = props;

  const { availablePost } = useAccount();

  const { network } = useNetwork();

  const viewOnTerraFinder = useCallback(() => {
    window.open(
      `https://finder.terra.money/${network.chainID}/account/${walletAddress}`,
      '_blank',
    );
  }, [network.chainID, walletAddress]);

  return (
    <WalletContent
      className={className}
      walletAddress={walletAddress}
      connectionName={connection.name}
      connectionIcon={connection.icon}
      readonly={connection.type === ConnectType.READONLY}
      onDisconnectWallet={onDisconnectWallet}
    >
      <>
        <TokenList onClose={onClose} onBuyUST={onBuyUST} />
        {availablePost && (
          <>
            <div className="bridge">
              <div>
                <Tooltip
                  title="Transfer Terra assets from Ethereum"
                  placement="top"
                >
                  <FlatButton
                    component="a"
                    href="https://bridge.terra.money/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src="/assets/bridge.png" alt="Terra Bridge" />
                  </FlatButton>
                </Tooltip>
                <FlatButton
                  component="a"
                  href="https://docs.anchorprotocol.com/user-guide/interchain-transfers"
                  target="_blank"
                  rel="noreferrer"
                >
                  Docs <Launch />
                </FlatButton>
              </div>
            </div>
            <div className="send">
              <FlatButton onClick={onSend}>SEND</FlatButton>
            </div>
            <div className="outlink">
              <button onClick={viewOnTerraFinder}>
                View on Terra Finder{' '}
                <i>
                  <KeyboardArrowRight />
                </i>
              </button>
              {process.env.NODE_ENV === 'development' && (
                <a
                  href="https://faucet.terra.money/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Go to Faucet{' '}
                  <i>
                    <KeyboardArrowRight />
                  </i>
                </a>
              )}
            </div>
          </>
        )}
      </>
    </WalletContent>
  );
};

export const Content = styled(ContentBase)`
  .bridge {
    margin-bottom: 10px;

    > div {
      display: flex;

      > :first-child {
        flex: 1;
        height: 28px;
        background-color: ${({ theme }) => theme.colors.positive};

        img {
          height: 24px;
          transform: translateX(5px);
        }

        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      > :last-child {
        font-size: 12px;

        width: 60px;
        height: 28px;
        margin-left: 1px;
        background-color: ${({ theme }) => theme.colors.positive};

        svg {
          margin-left: 3px;
          font-size: 1em;
          transform: scale(1.1);
        }

        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }

  .send {
    margin-bottom: 20px;

    button {
      width: 100%;
      height: 28px;

      background-color: ${({ theme }) => theme.colors.positive};
    }
  }

  .outlink {
    text-align: center;

    button,
    a {
      border: 0;
      outline: none;
      background-color: transparent;
      font-size: 12px;
      color: ${({ theme }) => theme.dimTextColor};
      display: inline-flex;
      align-items: center;

      i {
        margin-left: 5px;
        transform: translateY(1px);

        width: 16px;
        height: 16px;
        border-radius: 50%;

        svg {
          font-size: 11px;
          transform: translateY(1px);
        }

        background-color: ${({ theme }) =>
          theme.palette.type === 'light' ? '#f1f1f1' : 'rgba(0, 0, 0, 0.15)'};
        color: ${({ theme }) =>
          theme.palette.type === 'light'
            ? '#666666'
            : 'rgba(255, 255, 255, 0.6)'};

        &:hover {
          background-color: ${({ theme }) =>
            theme.palette.type === 'light' ? '#e1e1e1' : 'rgba(0, 0, 0, 0.2)'};
          color: ${({ theme }) =>
            theme.palette.type === 'light'
              ? '#666666'
              : 'rgba(255, 255, 255, 0.6)'};
        }
      }
    }
  }
`;
