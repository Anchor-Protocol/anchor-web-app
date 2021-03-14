import { Data } from 'base/queries/txInfos';
import { TxResult } from 'base/transactions/tx';

export const passTxInfo = ({
  txResult,
  txInfo,
}: {
  txResult: TxResult;
  txInfo: Data;
}) => ({
  txResult,
  txInfo,
});
