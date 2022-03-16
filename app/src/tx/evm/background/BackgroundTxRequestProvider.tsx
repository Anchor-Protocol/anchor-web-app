import { UIElementProps } from '@libs/ui';
import React, { useCallback, useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { usePersistedTx } from '../usePersistedTx';
import { BackgroundTxRequest, BackgroundTxRequestContext } from './context';

// Sample flow:
// - useDeposit -> register request -> usePersistedTx
// - minimize -> close UI -> registered request continues working as usual
// backgroundTransaction UI opens
//  - load stored tx from local storage
//  - use txHash to index background requests
//    - if no request found, register a new request under same hash
//    - otherwise continue with existing request (do nothing)
//  - register(Id | TxHash)
//    - if txHash is provided, check if already registered under that txHash
//    - if id is provided, check if already registered under that id
//    - else register new request
//  - updateTxHash(id, txHash)
//    - update request for id and given txHash
const registeredWithTxHash = (
  requests: BackgroundTxRequest[],
  txHash?: string,
): boolean => {
  return Boolean(txHash && requests.find((r) => r.txHash === txHash));
};

const registeredWithTxId = (
  requests: BackgroundTxRequest[],
  id: string,
): boolean => {
  return Boolean(requests.find((r) => r.id === id));
};

const alreadyRegistered = (
  requests: BackgroundTxRequest[],
  request: BackgroundTxRequest,
): boolean => {
  return (
    registeredWithTxHash(requests, request.txHash) ||
    registeredWithTxId(requests, request.id)
  );
};

export const BackgroundTxRequestProvider = ({ children }: UIElementProps) => {
  const [requests, setRequests] = useState<BackgroundTxRequest[]>([]);

  const register = useCallback(
    (request: BackgroundTxRequest) => {
      setRequests((prev) => {
        if (alreadyRegistered(prev, request)) {
          return prev;
        }
        return [...prev, request];
      });
    },
    [setRequests],
  );

  const unregister = useCallback(
    (id: string) => {
      setRequests((prev) => prev.filter((r) => r.id !== id));
    },
    [setRequests],
  );

  const updateRequest = useCallback(
    (id: string, updates: Partial<BackgroundTxRequest>) => {
      setRequests((prev) => {
        if (!registeredWithTxId(prev, id)) {
          return prev;
        }
        const request = prev.find((r) => r.id === id)!;
        return [...prev.filter((r) => r.id !== id), { ...request, ...updates }];
      });
    },
    [setRequests],
  );

  const getRequest = useCallback(
    (input: { id: string } | { txHash: string }) => {
      if ('id' in input) {
        return requests.find((r) => r.id === input.id);
      }

      return requests.find((r) => r.txHash === input.txHash);
    },
    [requests],
  );

  const value = useMemo(
    () => ({ register, getRequest }),
    [register, getRequest],
  );

  return (
    <BackgroundTxRequestContext.Provider value={value}>
      {children}
      <>
        {requests.map((request) => (
          <Request
            key={request.id}
            {...request}
            updateRequest={updateRequest}
            unregister={unregister}
          />
        ))}
      </>
    </BackgroundTxRequestContext.Provider>
  );
};

const Request = (
  props: BackgroundTxRequest & {
    updateRequest: (id: string, updates: Partial<BackgroundTxRequest>) => void;
    unregister: (txHash: string) => void;
  },
) => {
  const persistedTxResult = usePersistedTx(
    props.sendTx,
    props.parseTx,
    props.emptyTxResult,
    props.displayTx,
    () => {},
    (txHash) => props.updateRequest(props.id, { txHash }),
    props.txHash,
  );

  useInterval(() => {
    props.updateRequest(props.id, { persistedTxResult });
    // fucking rx-stream that throws random stream statuses on every render
  }, 100);

  return <></>;
};
