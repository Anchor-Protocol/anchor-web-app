import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import styled from 'styled-components';
import { useAnchorWebapp } from '@anchor-protocol/app-provider';
import { useAccount } from 'contexts/account';
import { useCW20Balance, useUstBalance } from '@libs/app-provider';
import big from 'big.js';
import { demicrofy, formatOutput } from '@anchor-protocol/formatter';
import { WithdrawableAsset, WithdrawableAssetProps } from './WithdrawableAsset';

interface WithdrawableAssetsProps extends UIElementProps {}

const WithdrawableAssetsBase = (props: WithdrawableAssetsProps) => {
  const { contractAddress } = useAnchorWebapp();
  const { terraWalletAddress, status } = useAccount();

  // depositStable UST (remote) -> aUST (terra) -> aUST (remote)
  // redeemStable aUST (remote) -> UST (terra) -> UST (remote)
  const ustCw20Balance = useUstBalance(terraWalletAddress);
  const ustBalance = formatOutput(demicrofy(ustCw20Balance, 6), {
    decimals: 6,
  });

  const aUstCw20Balance = useCW20Balance(
    contractAddress.cw20.aUST,
    terraWalletAddress,
  );
  const aUstBalance = formatOutput(demicrofy(aUstCw20Balance, 6), {
    decimals: 6,
  });

  const withdrawableAssets = useMemo<WithdrawableAssetProps[]>(() => {
    return [
      {
        tokenContract: contractAddress.cw20.aUST,
        symbol: 'aUST',
        balance: aUstBalance,
      },
      {
        tokenContract: 'uusd',
        symbol: 'UST',
        balance: ustBalance,
      },
    ].filter(
      (asset) =>
        asset.balance.length > 0 &&
        asset.balance.startsWith('<') === false &&
        big(asset.balance).gt(0),
    );
  }, [contractAddress.cw20.aUST, aUstBalance, ustBalance]);

  if (
    status !== 'connected' ||
    !terraWalletAddress ||
    withdrawableAssets.length === 0
  ) {
    return null;
  }

  return (
    <div className={props.className}>
      <div className="withdrawable-header">Unclaimed balances</div>
      <div className="withdrawable-assets">
        {withdrawableAssets.map((asset) => (
          <WithdrawableAsset
            className="withdrawable-asset"
            key={asset.tokenContract}
            {...asset}
          />
        ))}
      </div>
    </div>
  );
};

export const WithdrawableAssets = styled(WithdrawableAssetsBase)`
  .withdrawable-header {
    margin-top: 15px;
    color: ${({ theme }) => theme.textColor};
    font-size: 14px;
    font-weight: 500;
  }

  .withdrawable-assets {
    margin-top: 10px;
    margin-bottom: 10px;

    padding: 0;
    list-style: none;

    font-size: 12px;
    color: ${({ theme }) =>
      theme.palette.type === 'light' ? '#666666' : 'rgba(255, 255, 255, 0.6)'};

    border-top: 1px solid
      ${({ theme }) =>
        theme.palette.type === 'light'
          ? '#e5e5e5'
          : 'rgba(255, 255, 255, 0.1)'};

    .withdrawable-asset {
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
  }
`;
