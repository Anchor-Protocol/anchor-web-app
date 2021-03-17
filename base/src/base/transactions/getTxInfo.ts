import { OperationStop } from '@terra-dev/broadcastable-operation';
import { ApolloClient } from '@apollo/client';
import { TxInfoError } from '../errors/TxInfoError';
import { Data, queryTxInfo } from '../queries/txInfos';
import { TxResult } from './tx';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getTxInfo = (
  client: ApolloClient<any>,
  signal: AbortSignal,
) => async (
  txResult: TxResult,
): Promise<{ txResult: TxResult; txInfo: Data }> => {
  while (true) {
    if (signal.aborted) {
      throw new OperationStop();
    }

    const { data: txInfo } = await queryTxInfo(client, txResult.result.txhash);

    if (txInfo.length > 0) {
      const fail = txInfo.find(({ Success }) => !Success);

      if (fail) {
        throw new TxInfoError(fail.RawLog);
      }

      return { txResult, txInfo };
    } else {
      await sleep(500);
    }
  }
};
