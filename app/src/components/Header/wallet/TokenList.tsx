import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { UIElementProps } from '@libs/ui';
import { Launch } from '@material-ui/icons';
import big from 'big.js';
import { BuyButton } from 'components/BuyButton';
import { useBalances } from 'contexts/balances';
import React from 'react';
import styled from 'styled-components';

type Action = () => void;

interface TokenListProps extends UIElementProps {
  onClose: Action;
  onBuyUST?: Action;
}

export function TokenListBase(props: TokenListProps) {
  const { className, onClose, onBuyUST } = props;

  const { uUST, uaUST, uNative, uANC } = useBalances();

  const formatters = useFormatters();

  return (
    <ul className={className}>
      {big(uUST).gt(0) && (
        <li>
          <span>
            {formatters.ust.symbol}{' '}
            {onBuyUST && (
              <BuyButton
                onClick={() => {
                  onBuyUST();
                  onClose();
                }}
              >
                BUY <Launch />
              </BuyButton>
            )}
          </span>
          <span>
            {formatters.ust.formatOutput(formatters.ust.demicrofy(uUST))}
          </span>
        </li>
      )}
      {big(uaUST).gt(0) && (
        <li>
          <span>{formatters.aUST.symbol}</span>
          <span>
            {formatters.aUST.formatOutput(formatters.aUST.demicrofy(uaUST))}
          </span>
        </li>
      )}
      {big(uNative).gt(0) && (
        <li>
          <span>{formatters.native.symbol}</span>
          <span>
            {formatters.native.formatOutput(
              formatters.native.demicrofy(uNative),
            )}
          </span>
        </li>
      )}
      {big(uANC).gt(0) && (
        <li>
          <span>{formatters.anc.symbol}</span>
          <span>
            {formatters.anc.formatOutput(formatters.anc.demicrofy(uANC))}
          </span>
        </li>
      )}
    </ul>
  );
}

// {bAssetBalanceTotal?.infoAndBalances
//   .filter(({ balance }) => big(balance.balance).gt(0))
//   .map(({ bAsset, balance }) => (
//     <li key={'basset-' + bAsset.symbol}>
//       <span>
//         {bAsset.symbol}{' '}
//         {bAsset.symbol.toLowerCase() === 'beth' && (
//           <BuyLink
//             href="https://anchor.lido.fi/"
//             target="_blank"
//             rel="noreferrer"
//           >
//             GET <Launch />
//           </BuyLink>
//         )}
//       </span>
//       <span>{formatBAsset(demicrofy(balance.balance))}</span>
//     </li>
//   ))}

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
