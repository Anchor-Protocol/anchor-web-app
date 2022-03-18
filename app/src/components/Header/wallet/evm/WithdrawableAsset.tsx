import React, { useCallback, useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import styled, { useTheme } from 'styled-components';
import { useWithdrawAssetsTx } from 'tx/evm';
import { StreamStatus } from '@rx-stream/react';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { CircleSpinner } from 'react-spinners-kit';

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

  const loading = useMemo(
    () => txResult?.status === StreamStatus.IN_PROGRESS,
    [txResult],
  );

  const withdraw = useCallback(() => {
    withdrawAsset!({ tokenContract, amount: balance, symbol });
  }, [tokenContract, withdrawAsset, balance, symbol]);

  if (txResult?.status === StreamStatus.DONE) {
    return null;
  }

  return (
    <div className={props.className}>
      <div className="symbol">{symbol}</div>
      <div className="balance">
        <ActionButton
          className="withdraw"
          onClick={withdraw}
          disabled={loading}
        >
          {loading && (
            <CircleSpinner size={8} color={theme.actionButton.textColor} />
          )}
          <span className="action">withdraw</span>
        </ActionButton>
        <span>{balance}</span>
      </div>
    </div>
  );
};

export const WithdrawableAsset = styled(WithdrawableAssetBase)`
  .symbol {
  }

  .withdraw {
    height: 20px;
    font-size: 8px;
    margin-right: 10px;
    width: 70px;

    > .action {
      margin: 0 5px;
    }
  }
`;
