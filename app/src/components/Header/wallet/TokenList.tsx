import {
  formatANC,
  formatAUSTWithPostfixUnits,
  //formatBAsset,
  formatLP,
  formatLuna,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { demicrofy } from '@libs/formatter';
import { UIElementProps } from '@libs/ui';
import { Launch } from '@material-ui/icons';
import big from 'big.js';
//import { BuyButton, BuyLink } from 'components/BuyButton';
import { BuyButton } from 'components/BuyButton';
import { useTokenBalances } from 'contexts/balances';
import React from 'react';
import styled from 'styled-components';

type Action = () => void;

interface TokenListProps extends UIElementProps {
  onClose: Action;
  onBuyUST: Action;
}

export function TokenListBase(props: TokenListProps) {
  const { className, onClose, onBuyUST } = props;

  const tokenBalances = useTokenBalances();

  return (
    <ul className={className}>
      {big(tokenBalances.uUST).gt(0) && (
        <li>
          <span>
            UST{' '}
            <BuyButton
              onClick={() => {
                onBuyUST();
                onClose();
              }}
            >
              BUY <Launch />
            </BuyButton>
          </span>
          <span>
            {formatUSTWithPostfixUnits(demicrofy(tokenBalances.uUST))}
          </span>
        </li>
      )}

      {big(tokenBalances.uaUST).gt(0) && (
        <li>
          <span>aUST</span>
          <span>
            {formatAUSTWithPostfixUnits(demicrofy(tokenBalances.uaUST))}
          </span>
        </li>
      )}
      {big(tokenBalances.uLuna).gt(0) && (
        <li>
          <span>LUNA</span>
          <span>{formatLuna(demicrofy(tokenBalances.uLuna))}</span>
        </li>
      )}
      {big(tokenBalances.ubLuna).gt(0) && (
        <li>
          <span>bLUNA</span>
          <span>{formatLuna(demicrofy(tokenBalances.ubLuna))}</span>
        </li>
      )}
      {/* {bAssetBalanceTotal?.infoAndBalances
        .filter(({ balance }) => big(balance.balance).gt(0))
        .map(({ bAsset, balance }) => (
          <li key={'basset-' + bAsset.symbol}>
            <span>
              {bAsset.symbol}{' '}
              {bAsset.symbol.toLowerCase() === 'beth' && (
                <BuyLink
                  href="https://anchor.lido.fi/"
                  target="_blank"
                  rel="noreferrer"
                >
                  GET <Launch />
                </BuyLink>
              )}
            </span>
            <span>{formatBAsset(demicrofy(balance.balance))}</span>
          </li>
        ))}       */}
      {big(tokenBalances.uANC).gt(0) && (
        <li>
          <span>ANC</span>
          <span>{formatANC(demicrofy(tokenBalances.uANC))}</span>
        </li>
      )}

      {process.env.NODE_ENV === 'development' && (
        <>
          <li>
            <span>ANC-UST LP</span>
            <span>{formatLP(demicrofy(tokenBalances.uAncUstLP))}</span>
          </li>
          <li>
            <span>bLUNA-LUNA LP</span>
            <span>{formatLP(demicrofy(tokenBalances.ubLunaLunaLP))}</span>
          </li>
        </>
      )}
    </ul>
  );
}

export const TokenList = styled(TokenListBase)`
  margin-top: 48px;
  margin-bottom: 20px;

  padding: 0;
  list-style: none;

  font-size: 12px;
  color: ${({ theme }) =>
    theme.palette.type === 'light' ? '#666666' : 'rgba(255, 255, 255, 0.6)'};

  border-top: 1px solid
    ${({ theme }) =>
      theme.palette.type === 'light' ? '#e5e5e5' : 'rgba(255, 255, 255, 0.1)'};

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 35px;

    &:not(:last-child) {
      border-bottom: 1px dashed
        ${({ theme }) =>
          theme.palette.type === 'light'
            ? '#e5e5e5'
            : 'rgba(255, 255, 255, 0.1)'};
    }
  }
`;
