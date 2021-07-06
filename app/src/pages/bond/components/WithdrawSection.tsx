import { demicrofy, formatLuna } from '@anchor-protocol/notation';
import type { uLuna } from '@anchor-protocol/types';
import {
  useAnchorWebapp,
  useBondWithdrawableAmount,
  useBondWithdrawTx,
} from '@anchor-protocol/webapp-provider';
import { StreamStatus } from '@rx-stream/react';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { NativeSelect } from '@terra-dev/neumorphism-ui/components/NativeSelect';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from 'contexts/bank';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { validateTxFee } from 'logics/validateTxFee';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { withdrawAllHistory } from '../logics/withdrawAllHistory';

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
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedGas },
  } = useAnchorWebapp();

  const [withdraw, withdrawResult] = useBondWithdrawTx();

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
    data: {
      withdrawableUnbonded: _withdrawableAmount,
      unbondedRequests: withdrawRequests,
      unbondedRequestsStartFrom,
      allHistory,
      parameters,
    } = {},
  } = useBondWithdrawableAmount();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const withdrawHistory = useMemo(
    () =>
      withdrawAllHistory(
        withdrawRequests,
        unbondedRequestsStartFrom ?? -1,
        allHistory,
        parameters,
      ),
    [allHistory, parameters, unbondedRequestsStartFrom, withdrawRequests],
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

  const proceed = useCallback(() => {
    if (!connectedWallet || !withdraw) {
      return;
    }

    withdraw({});
  }, [connectedWallet, withdraw]);

  // ---------------------------------------------
  // effects
  // ---------------------------------------------
  useEffect(() => {
    onProgress(withdrawResult?.status === StreamStatus.IN_PROGRESS);
  }, [onProgress, withdrawResult?.status]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    withdrawResult?.status === StreamStatus.IN_PROGRESS ||
    withdrawResult?.status === StreamStatus.DONE
  ) {
    return (
      <Section>
        <TxResultRenderer
          resultRendering={withdrawResult.value}
          onExit={() => {
            switch (withdrawResult.status) {
              case StreamStatus.IN_PROGRESS:
                withdrawResult.abort();
                break;
              case StreamStatus.DONE:
                withdrawResult.clear();
                break;
            }
          }}
        />
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
              period can be withdrawn. Because burn requests are processed in
              3-day batches, requests that are not yet included in a batch are
              shown as pending.
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

      <ViewAddressWarning>
        <ActionButton
          className="submit"
          disabled={
            !connectedWallet ||
            !connectedWallet.availablePost ||
            !withdraw ||
            !!invalidTxFee ||
            withdrawableAmount.lte(0) ||
            disabled
          }
          onClick={() => proceed()}
        >
          Withdraw
        </ActionButton>
      </ViewAddressWarning>

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
                  <time>
                    {requestTime
                      ? requestTime.toLocaleString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }) +
                        ', ' +
                        requestTime.toLocaleTimeString('en-US')
                      : 'Pending'}
                  </time>
                </p>
                <p>{formatLuna(demicrofy(blunaAmount))} bLuna</p>
                <p>
                  Claimable time:{' '}
                  <time>
                    {claimableTime
                      ? claimableTime.toLocaleString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }) +
                        ', ' +
                        claimableTime.toLocaleTimeString('en-US')
                      : 'Pending'}
                  </time>
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
