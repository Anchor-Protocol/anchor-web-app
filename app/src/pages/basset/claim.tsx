import {
  fabricatebAssetClaim,
  fabricatebAssetWithdrawUnbonded,
} from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  demicrofy,
  formatLuna,
  formatUST,
  ubLuna,
  uLuna,
  uUST,
} from '@anchor-protocol/notation';
import {
  pressed,
  rulerLightColor,
  rulerShadowColor,
} from '@anchor-protocol/styled-neumorphism';
import {
  BroadcastableQueryOptions,
  useBroadcastableQuery,
} from '@anchor-protocol/use-broadcastable-query';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { ApolloClient, useApolloClient } from '@apollo/client';
import { CreateTxOptions, Dec, Int } from '@terra-money/terra.js';
import big, { Big } from 'big.js';
import {
  txNotificationFactory,
  TxResultRenderer,
} from 'components/TxResultRenderer';
import { WarningMessage } from 'components/WarningMessage';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { fixedGasUUSD, transactionFee } from 'env';
import * as txi from 'queries/txInfos';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { queryOptions } from 'transactions/queryOptions';
import { parseTxResult, StringifiedTxResult, TxResult } from 'transactions/tx';
import { useClaimable } from './queries/claimable';
import { useWithdrawable } from './queries/withdrawable';
import { useWithdrawHistory } from './queries/withdrawHistory';

export interface ClaimProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const assetCurrencies: Item[] = [{ label: 'Luna', value: 'luna' }];

function ClaimBase({ className }: ClaimProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const [
    queryWithdraw,
    withdrawResult,
    resetWithdrawResult,
  ] = useBroadcastableQuery(withdrawQueryOptions);

  const [queryClaim, claimResult, resetClaimResult] = useBroadcastableQuery(
    claimQueryOptions,
  );

  const client = useApolloClient();

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

  const { parsedData: claimable, refetch: refetchClaimable } = useClaimable();

  const { parsedData: withdrawAllHistory } = useWithdrawHistory({
    withdrawable,
  });

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const invalidTxFee = useMemo<ReactNode>(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (big(bank.userBalances.uUSD).lt(fixedGasUUSD)) {
      return 'Not Enough Tx Fee';
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD]);

  interface History {
    blunaAmount: ubLuna<Big>;
    lunaAmount?: uLuna<Big>;
    requestTime?: Date;
    claimableTime?: Date;
  }

  const withdrawHistory = useMemo<History[] | undefined>(() => {
    if (
      !withdrawable ||
      withdrawable.withdrawRequestsStartFrom < 0 ||
      !withdrawAllHistory
    ) {
      return undefined;
    }

    return withdrawable.withdrawRequests.requests.map<History>(
      ([index, amount]) => {
        const historyIndex: number =
          index - withdrawable.withdrawRequestsStartFrom;
        const matchingHistory =
          withdrawAllHistory.allHistory.history[historyIndex - 1];

        const blunaAmount = big(amount) as ubLuna<Big>;

        if (!matchingHistory) {
          return {
            blunaAmount,
          };
        }

        return {
          blunaAmount,
          lunaAmount: blunaAmount.mul(
            matchingHistory.withdraw_rate,
          ) as uLuna<Big>,
          requestTime: new Date(matchingHistory.time * 1000),
          claimableTime: new Date(
            (matchingHistory.time +
              withdrawAllHistory.parameters.unbonding_period) *
              1000,
          ),
        };
      },
    );
  }, [withdrawAllHistory, withdrawable]);

  const withdrawableAmount = useMemo<uLuna<Big>>(() => {
    return big(
      withdrawable?.withdrawableAmount.withdrawable ?? 0,
    ) as uLuna<Big>;
  }, [withdrawable?.withdrawableAmount.withdrawable]);

  const claimableRewards = useMemo<uUST<Big>>(() => {
    return claimable
      ? (big(
          new Int(
            new Int(claimable.claimableReward.balance).mul(
              new Dec(claimable.rewardState.global_index).sub(
                new Dec(claimable.claimableReward.index),
              ),
            ),
          )
            .add(new Int(claimable.claimableReward.pending_rewards))
            .toString(),
        ) as uUST<Big>)
      : (big(0) as uUST<Big>);
  }, [claimable]);

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

  const withdraw = useCallback(async () => {
    if (status.status !== 'ready' || bank.status !== 'connected') {
      return;
    }

    await queryWithdraw({
      post: post<CreateTxOptions, StringifiedTxResult>({
        ...transactionFee,
        msgs: fabricatebAssetWithdrawUnbonded({
          address: status.walletAddress,
          bAsset: 'bluna',
        })(addressProvider),
      })
        .then(({ payload }) => payload)
        .then(parseTxResult),
      client,
    });
  }, [addressProvider, bank.status, client, post, queryWithdraw, status]);

  const claim = useCallback(async () => {
    if (status.status !== 'ready' || bank.status !== 'connected') {
      return;
    }

    const data = await queryClaim({
      post: post<CreateTxOptions, StringifiedTxResult>({
        ...transactionFee,
        msgs: fabricatebAssetClaim({
          address: status.status === 'ready' ? status.walletAddress : '',
          bAsset: 'bluna',
          recipient: undefined,
        })(addressProvider),
      })
        .then(({ payload }) => payload)
        .then(parseTxResult),
      client,
    });

    // is this component does not unmounted
    if (data) {
      await refetchClaimable();
    }
  }, [
    addressProvider,
    bank.status,
    client,
    post,
    queryClaim,
    refetchClaimable,
    status,
  ]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    withdrawResult?.status === 'in-progress' ||
    withdrawResult?.status === 'done' ||
    withdrawResult?.status === 'error'
  ) {
    return (
      <div className={className}>
        <Section>
          {/* TODO implement messages */}
          <TxResultRenderer
            result={withdrawResult}
            resetResult={resetWithdrawResult}
          />
        </Section>
      </div>
    );
  } else if (
    claimResult?.status === 'in-progress' ||
    claimResult?.status === 'done' ||
    claimResult?.status === 'error'
  ) {
    return (
      <div className={className}>
        <Section>
          {/* TODO implement messages */}
          <TxResultRenderer
            result={claimResult}
            resetResult={resetClaimResult}
          />
        </Section>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Withdrawable */}
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
          <h4>Withdrawable Amount</h4>
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
            withdrawableAmount.lte(0)
          }
          onClick={() => withdraw()}
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

      {/* Claimable */}
      <Section>
        <article className="claimable-rewards">
          <h4>Claimable Rewards</h4>
          <p>
            {claimableRewards.gt(0)
              ? formatUST(demicrofy(claimableRewards)) + ' UST'
              : '-'}
          </p>
        </article>

        {!!invalidTxFee && big(claimableRewards).gt(0) && (
          <WarningMessage>{invalidTxFee}</WarningMessage>
        )}

        <ActionButton
          className="submit"
          disabled={
            status.status !== 'ready' ||
            bank.status !== 'connected' ||
            !!invalidTxFee ||
            claimableRewards.lte(0)
          }
          onClick={() => claim()}
        >
          Claim
        </ActionButton>
      </Section>
    </div>
  );
}

const withdrawQueryOptions: BroadcastableQueryOptions<
  { post: Promise<TxResult>; client: ApolloClient<any> },
  { txResult: TxResult } & { txInfos: txi.Data },
  Error
> = {
  ...queryOptions,
  group: 'basset/withdraw',
  notificationFactory: txNotificationFactory,
};

const claimQueryOptions: BroadcastableQueryOptions<
  { post: Promise<TxResult>; client: ApolloClient<any> },
  { txResult: TxResult } & { txInfos: txi.Data },
  Error
> = {
  ...queryOptions,
  group: 'basset/claim',
  notificationFactory: txNotificationFactory,
};

export const Claim = styled(ClaimBase)`
  > section {
    margin-bottom: 40px;
  }

  .bond {
    width: 100%;
    margin-bottom: 60px;
  }

  .withdrawable-amount,
  .claimable-rewards {
    text-align: center;

    h4 {
      font-size: 14px;
      font-weight: 300;
      color: ${({ theme }) => theme.dimTextColor};
      margin-bottom: 5px;
    }

    p {
      font-size: 48px;
      font-weight: 300;
      color: ${({ theme }) => theme.textColor};
    }

    margin-bottom: 30px;
  }

  .submit {
    width: 100%;
    height: 60px;
  }

  .withdraw-history {
    margin-top: 40px;

    max-height: 185px;
    overflow-y: auto;

    list-style: none;
    padding: 20px;

    border-radius: 5px;

    ${({ theme }) =>
      pressed({
        color: theme.backgroundColor,
        distance: 1,
        intensity: theme.intensity,
      })};

    li {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      justify-content: space-between;
      align-items: center;
      grid-gap: 5px;

      font-size: 12px;

      > :nth-child(odd) {
        color: ${({ theme }) => theme.dimTextColor};
      }

      > :nth-child(even) {
        text-align: right;
        color: ${({ theme }) => theme.textColor};
      }

      &:not(:last-child) {
        padding-bottom: 10px;

        border-bottom: 1px solid
          ${({ theme }) =>
            rulerShadowColor({
              color: theme.backgroundColor,
              intensity: theme.intensity,
            })};
      }

      &:not(:first-child) {
        padding-top: 10px;

        border-top: 1px solid
          ${({ theme }) =>
            rulerLightColor({
              color: theme.backgroundColor,
              intensity: theme.intensity,
            })};
      }
    }
  }
`;
