import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { darkTheme } from '@anchor-protocol/neumorphism-ui/themes/darkTheme';
import { ThemeProvider } from '@anchor-protocol/neumorphism-ui/themes/ThemeProvider';
import { BroadcastableQueryResult } from '@anchor-protocol/use-broadcastable-query';
import { UserDeniedError } from '@anchor-protocol/wallet-provider';
import { ApolloClient } from '@apollo/client';
import {
  SnackbarContent as MuiSnackbarContent,
  SnackbarContentProps,
} from '@material-ui/core';
import * as txi from 'api/queries/txInfos';
import { TxResult } from 'api/transactions/tx';
import React from 'react';
import styled from 'styled-components';

type Params = { post: Promise<TxResult>; client: ApolloClient<any> };
type Data = { txResult: TxResult } & { txInfos: txi.Data };

export interface TxResultRendererProps {
  result: BroadcastableQueryResult<Params, Data, Error>;
  resetResult: (() => void) | undefined;
}

export function TxResultRenderer({
  result,
  resetResult,
}: TxResultRendererProps) {
  if (result.status === 'in-progress') {
    return (
      <>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            Status:{' '}
            {result.data
              ? '2. Wating Block Creation...'
              : '1. Wating Terra Station Submit...'}
          </li>
          {result.data?.txResult && (
            <li>
              Terra Station Transaction
              <ul>
                <li>fee: {JSON.stringify(result.data?.txResult.fee)}</li>
                <li>gasAdjustment: {result.data?.txResult.gasAdjustment}</li>
                <li>height: {result.data?.txResult.result.height}</li>
                <li>txhash: {result.data?.txResult.result.txhash}</li>
              </ul>
            </li>
          )}
        </ul>
        {!result.data && (
          <ActionButton
            style={{ width: '100%' }}
            onClick={() => {
              result.abortController.abort();
              resetResult && resetResult();
            }}
          >
            Disconnect with Terra Station (Stop Waiting Terra Station Result)
          </ActionButton>
        )}
      </>
    );
  } else if (result?.status === 'done') {
    return (
      <>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>Status: Done</li>
          <li>
            Terra Station Transaction
            <ul>
              <li>fee: {JSON.stringify(result.data.txResult.fee)}</li>
              <li>gasAdjustment: {result.data.txResult.gasAdjustment}</li>
              <li>height: {result.data.txResult.result.height}</li>
              <li>txhash: {result.data.txResult.result.txhash}</li>
            </ul>
          </li>
        </ul>
        <ActionButton
          style={{ width: '100%' }}
          onClick={() => {
            resetResult && resetResult();
          }}
        >
          Exit Result
        </ActionButton>
      </>
    );
  } else if (result?.status === 'error') {
    return (
      <>
        <ul style={{ listStyle: 'none', padding: 0, color: 'red' }}>
          <li>Status: Error</li>
          {result.error instanceof UserDeniedError ? (
            <li>User Denied</li>
          ) : (
            <li>
              Error
              <ul>
                <li>error: {result.error.toString()}</li>
              </ul>
            </li>
          )}
        </ul>
        <ActionButton
          style={{ width: '100%' }}
          onClick={() => {
            resetResult && resetResult();
          }}
        >
          Exit Error
        </ActionButton>
      </>
    );
  }
  return null;
}

const ActionSnackbar = styled(
  ({
    result,
    close,
    ...props
  }: SnackbarContentProps & {
    result: BroadcastableQueryResult<Params, Data, Error>;
    close?: () => void;
  }) => {
    const message = <TxResultRenderer result={result} resetResult={close} />;

    return (
      <ThemeProvider theme={darkTheme}>
        <MuiSnackbarContent {...props} message={message} />
      </ThemeProvider>
    );
  },
)``;

export function txNotificationFactory(
  result: BroadcastableQueryResult<Params, Data, Error>,
) {
  return <ActionSnackbar result={result} />;
}
