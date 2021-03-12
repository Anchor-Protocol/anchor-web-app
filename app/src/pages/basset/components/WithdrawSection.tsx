import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { demicrofy, formatLuna } from '@anchor-protocol/notation';
import type { uLuna, uUST } from '@anchor-protocol/types';
import { WalletReady } from '@anchor-protocol/wallet-provider';
import { useBank } from '@anchor-protocol/web-contexts/contexts/bank';
import { useConstants } from '@anchor-protocol/web-contexts/contexts/contants';
import { useService } from '@anchor-protocol/web-contexts/contexts/service';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { validateTxFee } from 'logics/validateTxFee';
import { withdrawAllHistory } from 'pages/basset/logics/withdrawAllHistory';
import { useWithdrawable } from 'pages/basset/queries/withdrawable';
import { useWithdrawHistory } from 'pages/basset/queries/withdrawHistory';
import { withdrawOptions } from 'pages/basset/transactions/withdrawOptions';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

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
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const [withdraw, withdrawResult] = useOperation(withdrawOptions, {});

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

  const {
    data: { withdrawableAmount: _withdrawableAmount, withdrawRequests },
  } = useWithdrawable({
    bAsset: 'bluna',
  });

  const {
    data: { allHistory, parameters },
  } = useWithdrawHistory({
    withdrawRequestsStartFrom: withdrawRequests?.startFrom,
  });

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => serviceAvailable && validateTxFee(bank, fixedGas),
    [bank, fixedGas, serviceAvailable],
  );

  const withdrawHistory = useMemo(
    () => withdrawAllHistory(withdrawRequests, allHistory, parameters),
    [allHistory, parameters, withdrawRequests],
  );

  const withdrawableAmount = useMemo(
    () => big(_withdrawableAmount?.withdrawable ?? 0) as uLuna<Big>,
    [_withdrawableAmount?.withdrawable],
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

  const proceed = useCallback(
    async (walletReady: WalletReady) => {
      await withdraw({
        address: walletReady.walletAddress,
        bAsset: 'bluna',
        txFee: fixedGas.toString() as uUST,
      });
    },
    [fixedGas, withdraw],
  );

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
        <TransactionRenderer result={withdrawResult} />
      </Section>
    );
  }

  return (
    <Section>
      {assetCurrencies.length > 1 && (
        <NativeSelect
          className="bond"
          value={withdrawableCurrency.value}
          onChange={({ target }: ChangeEvent<HTMLSelectElement>) =>
            updateWithdrawableCurrency(target.value)
          }
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
        <MessageBox>{invalidTxFee}</MessageBox>
      )}

      <ActionButton
        className="submit"
        disabled={
          !serviceAvailable ||
          !!invalidTxFee ||
          withdrawableAmount.lte(0) ||
          disabled
        }
        onClick={() => walletReady && proceed(walletReady)}
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
