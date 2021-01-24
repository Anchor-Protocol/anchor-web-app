import { OperationResult } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { UserDeniedError } from '@anchor-protocol/wallet-provider';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { findTxResult } from 'transactions/tx';

export interface OperationRendererProps {
  className?: string;
  result: OperationResult<any, any>;
}

export function OperationRenderer({
  className,
  result,
}: OperationRendererProps) {
  const content = useMemo(() => {
    if (result.status === 'in-progress') {
      const txResult = findTxResult(result.snapshots);

      if (txResult) {
        return (
          <>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>Status: 2. Wating Block Creation...</li>
              <li>
                Terra Station Transaction
                <ul>
                  <li>fee: {JSON.stringify(txResult.fee)}</li>
                  <li>gasAdjustment: {txResult.gasAdjustment}</li>
                  <li>height: {txResult.result.height}</li>
                  <li>txhash: {txResult.result.txhash}</li>
                </ul>
              </li>
            </ul>
          </>
        );
      } else {
        return (
          <>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>Status: 1. Wating Terra Station Submit...</li>
            </ul>
            <ActionButton
              style={{ width: '100%' }}
              onClick={() => {
                result.abort();
              }}
            >
              Disconnect with Terra Station (Stop Waiting Terra Station Result)
            </ActionButton>
          </>
        );
      }
    } else if (result.status === 'fault') {
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
                  <li>error: {String(result.error)}</li>
                </ul>
              </li>
            )}
          </ul>
          <ActionButton
            style={{ width: '100%' }}
            onClick={() => {
              result.reset();
            }}
          >
            Exit Error
          </ActionButton>
        </>
      );
    } else {
      return null;
    }
  }, [result]);

  return <Container className={className}>{content}</Container>;
}

export const Container = styled.div`
  // TODO
`;
