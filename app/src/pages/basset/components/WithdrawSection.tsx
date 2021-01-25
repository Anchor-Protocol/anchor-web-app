import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { demicrofy, formatLuna } from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { useApolloClient } from '@apollo/client';
import { OperationRenderer } from 'components/OperationRenderer';
import { WarningMessage } from 'components/WarningMessage';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { useInvalidTxFee } from 'logics/useInvalidTxFee';
import { useWithdrawableAmount } from 'pages/basset/logics/useWithdrawableAmount';
import { useWithdrawAllHistory } from 'pages/basset/logics/useWithdrawAllHistory';
import { useWithdrawable } from 'pages/basset/queries/withdrawable';
import { useWithdrawHistory } from 'pages/basset/queries/withdrawHistory';
import { withdrawOptions } from 'pages/basset/transactions/withdrawOptions';
import React, { useCallback, useEffect, useState } from 'react';

export interface WithdrawSectionProps {
  disabled: boolean;
  onProgress: (inProgress: boolean) => void;
}

interface Item {
  label: string;
  value: string;
}

const assetCurrencies: Item[] = [{ label: 'Luna', value: 'luna' }];

export function WithdrawSection({
  disabled,
  onProgress,
}: WithdrawSectionProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const client = useApolloClient();

  const [withdraw, withdrawResult] = useOperation(withdrawOptions, {
    addressProvider,
    client,
    post,
  });

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [withdrawableCurrency, setWithdrawableCurrency] = useState<Item>(
    () => assetCurrencies[0],
  );

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const { parsedData: withdrawable } = useWithdrawable({
    bAsset: 'bluna',
  });

  const { parsedData: withdrawAllHistory } = useWithdrawHistory({
    withdrawable,
  });

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useInvalidTxFee(bank);

  const withdrawHistory = useWithdrawAllHistory(
    withdrawable?.withdrawRequestsStartFrom,
    withdrawable?.withdrawRequests.requests,
    withdrawAllHistory?.allHistory,
    withdrawAllHistory?.parameters,
  );
  const withdrawableAmount = useWithdrawableAmount(
    withdrawable?.withdrawableAmount.withdrawable,
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateWithdrawableCurrency = useCallback(
    (nextWithdrawableCurrencyValue: string) => {
      setWithdrawableCurrency(
        assetCurrencies.find(
          ({ value }) => nextWithdrawableCurrencyValue === value,
        ) ?? assetCurrencies[0],
      );
    },
    [],
  );

  const proceed = useCallback(async () => {
    if (status.status !== 'ready' || bank.status !== 'connected') {
      return;
    }

    await withdraw({
      address: status.walletAddress,
      bAsset: 'bluna',
    });
  }, [bank.status, status, withdraw]);

  // ---------------------------------------------
  // effects
  // ---------------------------------------------
  useEffect(() => {
    onProgress(withdrawResult?.status === 'in-progress');
  }, [onProgress, withdrawResult?.status]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    withdrawResult?.status === 'in-progress' ||
    withdrawResult?.status === 'done' ||
    withdrawResult?.status === 'fault'
  ) {
    return (
      <Section>
        {withdrawResult.status === 'done' ? (
          <div>
            <pre>{JSON.stringify(withdrawResult.data, null, 2)}</pre>
            <ActionButton style={{ width: 200 }} onClick={withdrawResult.reset}>
              Exit
            </ActionButton>
          </div>
        ) : (
          <OperationRenderer result={withdrawResult} />
        )}
      </Section>
    );
  }

  return (
    <Section>
      {assetCurrencies.length > 1 && (
        <NativeSelect
          className="bond"
          value={withdrawableCurrency.value}
          onChange={({ target }) => updateWithdrawableCurrency(target.value)}
        >
          {assetCurrencies.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </NativeSelect>
      )}

      <article className="withdrawable-amount">
        <h4>
          <IconSpan>
            Withdrawable Amount{' '}
            <InfoTooltip>
              bAssets that have been burned and have surpassed the undelegation
              period can be withdrawn
            </InfoTooltip>
          </IconSpan>
        </h4>
        <p>
          {withdrawableAmount.gt(0)
            ? formatLuna(demicrofy(withdrawableAmount)) +
              ' ' +
              withdrawableCurrency.label
            : '-'}
        </p>
      </article>

      {!!invalidTxFee && withdrawableAmount.gt(0) && (
        <WarningMessage>{invalidTxFee}</WarningMessage>
      )}

      <ActionButton
        className="submit"
        disabled={
          status.status !== 'ready' ||
          bank.status !== 'connected' ||
          !!invalidTxFee ||
          withdrawableAmount.lte(0) ||
          disabled
        }
        onClick={() => proceed()}
      >
        Withdraw
      </ActionButton>

      {withdrawHistory && withdrawHistory.length > 0 && (
        <ul className="withdraw-history">
          {withdrawHistory.map(
            (
              { blunaAmount, lunaAmount, requestTime, claimableTime },
              index,
            ) => (
              <li key={`withdraw-history-${index}`}>
                <p>
                  Requested time:{' '}
                  <time>{requestTime?.toLocaleString() ?? 'Pending'}</time>
                </p>
                <p>{formatLuna(demicrofy(blunaAmount))} bLuna</p>
                <p>
                  Claimable time:{' '}
                  <time>{claimableTime?.toLocaleString() ?? 'Pending'}</time>
                </p>
                <p>
                  {lunaAmount
                    ? `${formatLuna(demicrofy(lunaAmount))} Luna`
                    : ''}
                </p>
              </li>
            ),
          )}
        </ul>
      )}
    </Section>
  );
}
