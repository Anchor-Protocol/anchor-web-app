import { Data } from 'base/queries/txInfos';
import { TxResult } from '@anchor-protocol/wallet-provider2';

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
