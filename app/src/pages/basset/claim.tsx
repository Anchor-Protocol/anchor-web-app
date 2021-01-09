import {
  fabricatebAssetClaim,
  fabricatebAssetWithdrawUnbonded,
} from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { MICRO, toFixedNoRounding } from '@anchor-protocol/notation';
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
import { CreateTxOptions } from '@terra-money/terra.js';
import * as txi from 'api/queries/txInfos';
import { queryOptions } from 'api/transactions/queryOptions';
import {
  parseResult,
  StringifiedTxResult,
  TxResult,
} from 'api/transactions/tx';
import {
  txNotificationFactory,
  TxResultRenderer,
} from 'api/transactions/TxResultRenderer';
import big from 'big.js';
import { useAddressProvider } from 'contexts/contract';
import { transactionFee } from 'env';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
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

const currencies: Item[] = [{ label: 'Luna', value: 'luna' }];

function ClaimBase({ className }: ClaimProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const [
    fetchWithdraw,
    withdrawResult,
    resetWithdrawResult,
  ] = useBroadcastableQuery(withdrawQueryOptions);

  const [fetchClaim, claimResult, resetClaimResult] = useBroadcastableQuery(
    claimQueryOptions,
  );

  const client = useApolloClient();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [currency, setCurrency] = useState<Item>(() => currencies[0]);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { parsedData: withdrawable, updateWithdrawable } = useWithdrawable({
    bAsset: 'bluna',
  });
  const { parsedData: claimable } = useClaimable();
  const { parsedData: withdrawAllHistory } = useWithdrawHistory({
    withdrawable,
  });

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  interface History {
    blunaAmount: string;
    lunaAmount?: string;
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
          withdrawAllHistory.allHistory.history[historyIndex];

        if (!matchingHistory) {
          return {
            blunaAmount: amount,
          };
        }

        return {
          blunaAmount: amount,
          lunaAmount: big(amount).mul(matchingHistory.withdraw_rate).toString(),
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

  const withdrawableAmount = useMemo(() => {
    return big(withdrawable?.withdrawableAmount.withdrawable ?? 0);
  }, [withdrawable?.withdrawableAmount.withdrawable]);

  const claimableRewards = useMemo(() => {
    return claimable
      ? big(
          big(
            big(claimable.claimableReward.balance).mul(
              big(claimable.rewardState.global_index).sub(
                claimable.claimableReward.index,
              ),
            ),
          ).add(claimable.claimableReward.pending_rewards),
        )
      : big(0);
  }, [claimable]);

  console.log('claim.tsx..ClaimBase()', { withdrawResult, claimResult });

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
      <Section>
        {currencies.length > 1 && (
          <NativeSelect
            className="bond"
            value={currency.value}
            onChange={({ target }) =>
              setCurrency(
                currencies.find(({ value }) => target.value === value) ??
                  currencies[0],
              )
            }
          >
            {currencies.map(({ label, value }) => (
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
              ? toFixedNoRounding(withdrawableAmount.div(MICRO), 2) + ' Luna'
              : '-'}
          </p>
        </article>

        <ActionButton
          className="submit"
          disabled={status.status !== 'ready' || withdrawableAmount.lte(0)}
          onClick={() =>
            fetchWithdraw({
              post: post<CreateTxOptions, StringifiedTxResult>({
                ...transactionFee,
                msgs: fabricatebAssetWithdrawUnbonded({
                  address:
                    status.status === 'ready' ? status.walletAddress : '',
                  bAsset: 'bluna',
                })(addressProvider),
              })
                .then(({ payload }) => payload)
                .then(parseResult),
              client,
            }).then((data) => {
              if (data) {
                updateWithdrawable();
              }
            })
          }
        >
          Withdraw
        </ActionButton>

        <ul className="withdraw-history">
          {withdrawHistory &&
            withdrawHistory.length > 0 &&
            withdrawHistory.map(
              (
                { blunaAmount, lunaAmount, requestTime, claimableTime },
                index,
              ) => (
                <li key={`withdraw-history-${index}`}>
                  <p>
                    Requested time:{' '}
                    <time>{requestTime?.toLocaleString() ?? 'Pending'}</time>
                  </p>
                  <p>
                    {toFixedNoRounding(big(blunaAmount).div(MICRO), 2)} bLuna
                  </p>
                  <p>
                    Claimable time:{' '}
                    <time>{claimableTime?.toLocaleString() ?? 'Pending'}</time>
                  </p>
                  <p>
                    {lunaAmount
                      ? `${toFixedNoRounding(
                          big(lunaAmount).div(MICRO),
                          2,
                        )} Luna`
                      : ''}
                  </p>
                </li>
              ),
            )}
        </ul>
      </Section>

      <Section>
        <article className="claimable-rewards">
          <h4>Claimable Rewards</h4>
          <p>
            {claimableRewards.gt(0)
              ? toFixedNoRounding(claimableRewards.div(MICRO), 2) + ' UST'
              : '-'}
          </p>
        </article>

        <ActionButton
          className="submit"
          disabled={status.status !== 'ready' || claimableRewards.lte(0)}
          onClick={() =>
            fetchClaim({
              post: post<CreateTxOptions, StringifiedTxResult>({
                ...transactionFee,
                msgs: fabricatebAssetClaim({
                  address:
                    status.status === 'ready' ? status.walletAddress : '',
                  bAsset: 'bluna',
                  recipient: undefined,
                })(addressProvider),
              })
                .then(({ payload }) => payload)
                .then(parseResult),
              client,
            })
          }
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
