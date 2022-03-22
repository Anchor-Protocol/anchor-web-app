import React, { useCallback } from 'react';
import { UIElementProps } from '@libs/ui';
import styled, { useTheme } from 'styled-components';
import { useWithdrawAssetsTx } from 'tx/evm';
import { StreamStatus } from '@rx-stream/react';
import { CircleSpinner } from 'react-spinners-kit';
import { Tooltip } from '@material-ui/core';
import { Launch } from '@material-ui/icons';

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
        {loading ? (
          <span className="spinner">
            <CircleSpinner size={14} color={theme.colors.secondaryDark} />
          </span>
        ) : (
          <Tooltip title={`Withdraw ${symbol}`} placement="top">
            <Launch className="withdraw-button" onClick={withdraw} />
          </Tooltip>
        )}
        {symbol}
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

  .spinner,
  .withdraw-button {
    margin-right: 5px;
    width: 14px;
    height: 14px;
  }

  .withdraw-button {
    cursor: pointer;
    color: ${({ theme }) => theme.dimTextColor};
    &:hover {
      color: ${({ theme }) => theme.colors.secondaryDark};
    }
  }
`;
