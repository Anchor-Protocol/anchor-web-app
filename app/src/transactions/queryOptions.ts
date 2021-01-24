import {
  BroadcastableQueryOptions,
  stopWithAbortSignal,
} from '@anchor-protocol/use-broadcastable-query';
import { ApolloClient } from '@apollo/client';
import { Data, queryTxInfo } from 'queries/txInfos';
import { TxResult } from 'transactions/tx';
import { TxError } from 'transactions/TxError';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @deprecated
 */
export const queryOptions: Omit<
  BroadcastableQueryOptions<
    { post: Promise<TxResult>; client: ApolloClient<any> },
    { txResult: TxResult } & { txInfos: Data },
    Error
  >,
  'notificationFactory'
> = {
  broadcastWhen: 'unmounted',
  //breakOnError: true,
  fetchClient: async (
    { post, client },
    { signal, inProgressUpdate, stopSignal },
  ) => {
    const txResult = await stopWithAbortSignal(post, signal);

    if (!txResult.success) {
      throw new TxError(txResult.msgs);
    }

    inProgressUpdate({ txResult });

    while (true) {
      if (signal.aborted) {
        throw stopSignal;
      }

      const { parsedData: txInfos } = await queryTxInfo(
        client,
        txResult.result.txhash,
      );

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
