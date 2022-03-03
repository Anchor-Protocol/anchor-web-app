import React from 'react';
import { Connection } from '@libs/evm-wallet';
import { WalletContent } from '../WalletContent';
import { UIElementProps } from '@libs/ui';
import { HumanAddr } from '@libs/types';
import styled from 'styled-components';
import { TokenList } from '../TokenList';
import { Link } from 'react-router-dom';

type Action = () => void;

interface ContentProps extends UIElementProps {
  walletAddress: HumanAddr;
  connection: Connection;
  onClose: Action;
  onDisconnectWallet: Action;
}

const ContentBase = (props: ContentProps) => {
  const { className, walletAddress, connection, onClose, onDisconnectWallet } =
    props;

  return (
    <WalletContent
      className={className}
      walletAddress={walletAddress}
      connectionName={connection.name}
      connectionIcon={connection.icon}
      readonly={false}
      onDisconnectWallet={onDisconnectWallet}
    >
      <TokenList onClose={onClose} />
      <div className="restore-tx">
        <div className="restore-tx-inner">
          <div>Having transaction issues?</div>
          <Link className="link" to="/bridge/restore">
            Restore transaction
          </Link>
        </div>
      </div>
    </WalletContent>
  );
};

export const Content = styled(ContentBase)`
  .restore-tx {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    font-weight: 500;
    color: ${({ theme }) => theme.dimTextColor};
    margin-bottom: 10px;
  }

  .restore-tx-inner {
    width: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .link {
    margin-top: 5px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.secondaryDark};
  }
`;
