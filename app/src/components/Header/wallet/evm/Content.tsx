import React, { useState } from 'react';
import { Connection, useEvmWallet } from '@libs/evm-wallet';
import { WalletContent } from '../WalletContent';
import { UIElementProps } from '@libs/ui';
import { HumanAddr } from '@libs/types';
import styled from 'styled-components';
import { TokenList, TokenListType } from '../TokenList';
import { Link } from 'react-router-dom';
import { WithdrawableAssets } from './WithdrawableAssets';
import { getAddress } from 'configurations/evm/addresses';
import { useFormatters } from '@anchor-protocol/formatter';

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

  const {
    chainId,
    actions: { watchAsset },
  } = useEvmWallet();

  const [adding, setAdding] = useState(false);

  const formatters = useFormatters();

  const onAddToken = (token: TokenListType) => {
    if (chainId) {
      switch (token) {
        case 'UST':
          watchAsset({
            address: getAddress(chainId, token),
            symbol: formatters.ust.symbol,
            decimals: formatters.ust.decimals,
            image:
              'https://s2.coinmarketcap.com/static/img/coins/200x200/7129.png',
          });
          break;
        case 'aUST':
          watchAsset({
            address: getAddress(chainId, token),
            symbol: formatters.aUST.symbol,
            decimals: formatters.aUST.decimals,
            image:
              'https://s2.coinmarketcap.com/static/img/coins/64x64/16886.png',
          });
          break;
        case 'ANC':
          watchAsset({
            address: getAddress(chainId, token),
            symbol: formatters.anc.symbol,
            decimals: formatters.anc.decimals,
            image:
              'https://s2.coinmarketcap.com/static/img/coins/64x64/8857.png',
          });
          break;
      }
    }
  };

  return (
    <WalletContent
      className={className}
      walletAddress={walletAddress}
      connectionName={connection.name}
      connectionIcon={connection.icon}
      readonly={false}
      onDisconnectWallet={onDisconnectWallet}
    >
      <TokenList
        onClose={onClose}
        onAddToken={adding ? onAddToken : undefined}
      />
      <button className="add-wallet" onClick={() => setAdding((prev) => !prev)}>
        {adding ? 'Done' : 'Add to Wallet'}
      </button>
      <WithdrawableAssets />
      <div className="restore-tx">
        <div className="restore-tx-inner">
          <p>Having transaction issues?</p>
          <Link className="link" to="/bridge/restore" onClick={onClose}>
            Restore transaction
          </Link>
        </div>
      </div>
    </WalletContent>
  );
};

export const Content = styled(ContentBase)`
  .add-wallet {
    margin: auto;
    border: none;
    background: none;
    outline: none;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.positive};
    margin-bottom: 10px;
  }

  .restore-tx {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.dimTextColor};
    margin-top: 20px;

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
  }
`;
