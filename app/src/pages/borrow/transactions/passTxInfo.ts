import { Data } from 'base/queries/txInfos';
import { TxResult } from '@anchor-protocol/wallet-provider';

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
