import {
  BroadcastableQueryOptions,
  stopWithAbortSignal,
} from '@anchor-protocol/use-broadcastable-query';
import { ApolloClient } from '@apollo/client';
import {
  Data,
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../queries/txInfos';
import { TxResult } from './tx';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const queryOptions: Omit<
  BroadcastableQueryOptions<
    { post: Promise<TxResult>; client: ApolloClient<any> },
    { txResult: TxResult } & { txInfos: Data },
    Error
  >,
  'notificationFactory'
> = {
  broadcastWhen: 'unmounted',
  fetchClient: async (
    { post, client },
    { signal, inProgressUpdate, stopSignal },
  ) => {
    const txResult = await stopWithAbortSignal(post, signal);

    inProgressUpdate({ txResult });

    while (true) {
      if (signal.aborted) {
        throw stopSignal;
      }

      const txInfos = await client
        .query<StringifiedData, StringifiedVariables>({
          query,
          fetchPolicy: 'network-only',
          variables: stringifyVariables({
            txHash: txResult.result.txhash,
          }),
        })
        .then(({ data }) => parseData(data));

      if (txInfos.length > 0) {
        const fail = txInfos.find(({ Success }) => !Success);

        if (fail) {
          throw new Error(fail.RawLog.toString());
        }

        return { txResult, txInfos };
      } else {
        await sleep(500);
      }
    }
  },
};