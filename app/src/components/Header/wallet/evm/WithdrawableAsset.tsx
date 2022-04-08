import React, { useCallback } from 'react';
import { UIElementProps } from '@libs/ui';
import styled, { useTheme } from 'styled-components';
import { useWithdrawAssetsTx } from 'tx/evm';
import { StreamStatus } from '@rx-stream/react';
import { CircleSpinner } from 'react-spinners-kit';
import { WithdrawButton } from './WithdrawButton';

export interface WithdrawableAssetProps extends UIElementProps {
  tokenContract: string;
  balance: string;
  symbol: string;
}

const WithdrawableAssetBase = (props: WithdrawableAssetProps) => {
  const { tokenContract, balance, symbol } = props;
  const withdrawAssetsTx = useWithdrawAssetsTx();
  const [withdrawAsset, txResult] = withdrawAssetsTx?.stream ?? [null, null];
  const theme = useTheme();

  const withdraw = useCallback(() => {
    withdrawAsset!({ tokenContract, amount: balance, symbol });
  }, [tokenContract, withdrawAsset, balance, symbol]);

  if (txResult?.status === StreamStatus.DONE) {
    return null;
  }

  const loading = txResult?.status === StreamStatus.IN_PROGRESS;

  return (
    <div className={props.className}>
      <div className="symbol">
        {loading && (
          <span className="spinner">
            <CircleSpinner size={14} color={theme.colors.positive} />
          </span>
        )}
        {symbol}
        {loading === false && (
          <WithdrawButton className="button" onClick={withdraw} />
        )}
      </div>
      <span>{balance}</span>
    </div>
  );
};

export const WithdrawableAsset = styled(WithdrawableAssetBase)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 35px;

  .symbol {
    display: inline-flex;
    align-items: center;
  }

  .button {
    margin-left: 5px;
  }

  .spinner {
    margin-right: 5px;
    width: 14px;
    height: 14px;
  }
`;
