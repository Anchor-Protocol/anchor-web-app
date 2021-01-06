import {
  fabricatebAssetClaim,
  fabricatebAssetWithdrawUnbonded,
} from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { MICRO, toFixedNoRounding } from '@anchor-protocol/number-notation';
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
import { ApolloClient, useApolloClient, useQuery } from '@apollo/client';
import { SnackbarContent as MuiSnackbarContent } from '@material-ui/core';
import { CreateTxOptions } from '@terra-money/terra.js';
import big from 'big.js';
import { transactionFee } from 'env';
import * as clm from 'pages/basset/queries/claimable';
import * as txi from 'pages/basset/queries/txInfos';
import * as wdw from 'pages/basset/queries/withdrawable';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';
import { useAddressProvider } from '../../providers/address-provider';
import { queryOptions } from './transactions/queryOptions';
import { parseResult, StringifiedTxResult, TxResult } from './transactions/tx';

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

  const [history, setHistory] = useState<ReactNode>(() => null);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const [now, setNow] = useState(() => Date.now());

  const { data: withdrawableData } = useQuery<
    wdw.StringifiedData,
    wdw.StringifiedVariables
  >(wdw.query, {
    skip: status.status !== 'ready',
    variables: wdw.stringifyVariables({
      bLunaHubContract: addressProvider.bAssetHub('bluna'),
      withdrawableAmountQuery: {
        withdrawable_unbonded: {
          address: status.status === 'ready' ? status.walletAddress : '',
          block_time: now,
        },
      },
      withdrawRequestsQuery: {
        unbond_requests: {
          address: status.status === 'ready' ? status.walletAddress : '',
        },
      },
      exchangeRateQuery: {
        state: {},
      },
    }),
  });

  const { data: claimableData } = useQuery<
    clm.StringifiedData,
    clm.StringifiedVariables
  >(clm.query, {
    skip: status.status !== 'ready',
    variables: clm.stringifyVariables({
      bAssetRewardContract: addressProvider.bAssetReward('bluna'),
      rewardState: {
        state: {},
      },
      claimableRewardQuery: {
        holder: {
          address: status.status === 'ready' ? status.walletAddress : '',
        },
      },
    }),
  });

  const withdrawable = useMemo(
    () => (withdrawableData ? wdw.parseData(withdrawableData) : undefined),
    [withdrawableData],
  );

  const claimable = useMemo(
    () => (claimableData ? clm.parseData(claimableData) : undefined),
    [claimableData],
  );

  // ---------------------------------------------
  // TODO remove
  // ---------------------------------------------
  const updateHistory = useCallback(() => {
    setHistory(
      Math.random() > 0.5 ? (
        <li>
          <p>
            Requested time: <time>09:27, 2 Oct 2020</time>
          </p>
          <p>101 bLuna</p>
          <p>
            Claimable time: <time>09:27, 2 Oct 2020</time>
          </p>
          <p>101 Luna</p>
        </li>
      ) : (
        Array.from({ length: Math.floor(Math.random() * 10) }, (_, i) => (
          <li key={'history' + i}>
            <p>
              Requested time: <time>09:27, 2 Oct 2020</time>
            </p>
            <p>101 bLuna</p>
            <p>
              Claimable time: <time>09:27, 2 Oct 2020</time>
            </p>
            <p>101 Luna</p>
          </li>
        ))
      ),
    );
  }, []);

  useEffect(() => {
    updateHistory();
  }, [updateHistory]);

  console.log('claim.tsx..ClaimBase()', { withdrawResult, claimResult });

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (withdrawResult?.status === 'in-progress') {
    return (
      <div className={className}>
        <Section>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              Status:{' '}
              {withdrawResult.data
                ? '2. Wating Block Creation...'
                : '1. Wating Terra Station Submit...'}
            </li>
            {withdrawResult.data?.txResult && (
              <li>
                Terra Station Transaction
                <ul>
                  <li>
                    fee: {JSON.stringify(withdrawResult.data?.txResult.fee)}
                  </li>
                  <li>
                    gasAdjustment: {withdrawResult.data?.txResult.gasAdjustment}
                  </li>
                  <li>height: {withdrawResult.data?.txResult.result.height}</li>
                  <li>txhash: {withdrawResult.data?.txResult.result.txhash}</li>
                </ul>
              </li>
            )}
          </ul>
          {!withdrawResult.data && (
            <ActionButton
              style={{ width: '100%' }}
              onClick={() => {
                withdrawResult.abortController.abort();
                resetWithdrawResult && resetWithdrawResult();
              }}
            >
              Disconnect with Terra Station (Stop Waiting Terra Station Result)
            </ActionButton>
          )}
        </Section>
      </div>
    );
  } else if (withdrawResult?.status === 'done') {
    return (
      <div className={className}>
        <Section>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>Status: Done</li>
            <li>
              Terra Station Transaction
              <ul>
                <li>fee: {JSON.stringify(withdrawResult.data.txResult.fee)}</li>
                <li>
                  gasAdjustment: {withdrawResult.data.txResult.gasAdjustment}
                </li>
                <li>height: {withdrawResult.data.txResult.result.height}</li>
                <li>txhash: {withdrawResult.data.txResult.result.txhash}</li>
              </ul>
            </li>
          </ul>
          <ActionButton
            style={{ width: '100%' }}
            onClick={() => {
              resetWithdrawResult && resetWithdrawResult();
            }}
          >
            Exit Result
          </ActionButton>
        </Section>
      </div>
    );
  } else if (claimResult?.status === 'in-progress') {
    return (
      <div className={className}>
        <Section>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              Status:{' '}
              {claimResult.data
                ? '2. Wating Block Creation...'
                : '1. Wating Terra Station Submit...'}
            </li>
            {claimResult.data?.txResult && (
              <li>
                Terra Station Transaction
                <ul>
                  <li>fee: {JSON.stringify(claimResult.data?.txResult.fee)}</li>
                  <li>
                    gasAdjustment: {claimResult.data?.txResult.gasAdjustment}
                  </li>
                  <li>height: {claimResult.data?.txResult.result.height}</li>
                  <li>txhash: {claimResult.data?.txResult.result.txhash}</li>
                </ul>
              </li>
            )}
          </ul>
          {!claimResult.data && (
            <ActionButton
              style={{ width: '100%' }}
              onClick={() => {
                claimResult.abortController.abort();
                resetClaimResult && resetClaimResult();
              }}
            >
              Disconnect with Terra Station (Stop Waiting Terra Station Result)
            </ActionButton>
          )}
        </Section>
      </div>
    );
  } else if (claimResult?.status === 'done') {
    return (
      <div className={className}>
        <Section>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>Status: Done</li>
            <li>
              Terra Station Transaction
              <ul>
                <li>fee: {JSON.stringify(claimResult.data.txResult.fee)}</li>
                <li>
                  gasAdjustment: {claimResult.data.txResult.gasAdjustment}
                </li>
                <li>height: {claimResult.data.txResult.result.height}</li>
                <li>txhash: {claimResult.data.txResult.result.txhash}</li>
              </ul>
            </li>
          </ul>
          <ActionButton
            style={{ width: '100%' }}
            onClick={() => {
              resetClaimResult && resetClaimResult();
            }}
          >
            Exit Result
          </ActionButton>
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
            {toFixedNoRounding(
              big(withdrawable?.withdrawableAmount.withdrawable ?? 0).div(
                MICRO,
              ),
              2,
            )}{' '}
            Luna
          </p>
        </article>

        {status.status === 'ready' ? (
          <ActionButton
            className="submit"
            onClick={() =>
              fetchWithdraw({
                post: post<CreateTxOptions, StringifiedTxResult>({
                  ...transactionFee,
                  msgs: fabricatebAssetWithdrawUnbonded({
                    address: status.walletAddress,
                    bAsset: 'bluna',
                  })(addressProvider),
                })
                  .then(({ payload }) => payload)
                  .then(parseResult),
                client,
              }).then((data) => {
                if (data) {
                  setNow(Date.now());
                }
              })
            }
          >
            Withdraw
          </ActionButton>
        ) : (
          <ActionButton className="submit" disabled>
            Withdraw
          </ActionButton>
        )}

        <ul className="withdraw-history">{history}</ul>
      </Section>

      <Section>
        <article className="claimable-rewards">
          <h4>Claimable Rewards</h4>
          <p>
            {claimable
              ? toFixedNoRounding(
                  big(
                    big(
                      big(claimable.claimableReward.balance).mul(
                        big(claimable.rewardState.global_index).sub(
                          claimable.claimableReward.index,
                        ),
                      ),
                    ).add(claimable.claimableReward.pending_rewards),
                  ).div(MICRO),
                  2,
                )
              : '0'}{' '}
            UST
          </p>
        </article>

        {status.status === 'ready' ? (
          <ActionButton
            className="submit"
            onClick={() =>
              fetchClaim({
                post: post<CreateTxOptions, StringifiedTxResult>({
                  ...transactionFee,
                  msgs: fabricatebAssetClaim({
                    address: status.walletAddress,
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
        ) : (
          <ActionButton className="submit" disabled>
            Claim
          </ActionButton>
        )}
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
  notificationFactory: (result) => {
    return (
      <MuiSnackbarContent
        message={`${result.status}: ${
          'data' in result ? Object.keys(result.data ?? {}).join(', ') : ''
        }`}
      />
    );
  },
};

const claimQueryOptions: BroadcastableQueryOptions<
  { post: Promise<TxResult>; client: ApolloClient<any> },
  { txResult: TxResult } & { txInfos: txi.Data },
  Error
> = {
  ...queryOptions,
  group: 'basset/claim',
  notificationFactory: (result) => {
    return (
      <MuiSnackbarContent
        message={`${result.status}: ${
          'data' in result ? Object.keys(result.data ?? {}).join(', ') : ''
        }`}
      />
    );
  },
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
