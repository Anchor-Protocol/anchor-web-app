import { Data } from '@anchor-protocol/web-contexts/queries/txInfos';
import { TxResult } from '@anchor-protocol/web-contexts/transactions/tx';

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
