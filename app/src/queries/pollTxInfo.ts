import { ApolloClient } from '@apollo/client';
import { Timeout, TxFailed, TxResult } from '@terra-dev/wallet-types';
import { CreateTxOptions } from '@terra-money/terra.js';
import { Data, queryTxInfo } from 'base/queries/txInfos';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollTxInfo = (
  client: ApolloClient<any>,
  tx: CreateTxOptions,
) => async (txResult: TxResult): Promise<Data> => {
  const until = Date.now() + 1000 * 20;

  while (true) {
    const { data: txInfo } = await queryTxInfo(client, txResult.result.txhash);

    if (txInfo.length > 0) {
      const fail = txInfo.find(({ Success }) => !Success);

      if (fail) {
        throw new TxFailed(
          tx,
          txResult.result.txhash,
          typeof fail.RawLog === 'string'
            ? fail.RawLog
            : fail.RawLog.map(({ log }) => log).join('\n'),
          fail.RawLog,
        );
      }

      return txInfo;
    } else if (Date.now() < until) {
      await sleep(500);
    } else {
      throw new Timeout(`Could not get TxInfo for 20 seconds`);
    }
  }
};
