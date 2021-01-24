import {
  OperationStop,
  OperatorOption,
} from '@anchor-protocol/broadcastable-operation';
import { ApolloClient } from '@apollo/client';
import { Data, queryTxInfo } from 'queries/txInfos';
import { TxResult } from 'transactions/tx';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getTxInfo = (client: ApolloClient<any>) => async (
  txResult: TxResult,
  { signal }: OperatorOption,
): Promise<{ txResult: TxResult; txInfo: Data }> => {
  while (true) {
    if (signal.aborted) {
      throw new OperationStop();
    }

    const { parsedData: txInfo } = await queryTxInfo(
      client,
      txResult.result.txhash,
    );

    if (txInfo.length > 0) {
      const fail = txInfo.find(({ Success }) => !Success);

      if (fail) {
        throw new Error(fail.RawLog.toString());
      }

      return { txResult, txInfo };
    } else {
      await sleep(500);
    }
  }
};
