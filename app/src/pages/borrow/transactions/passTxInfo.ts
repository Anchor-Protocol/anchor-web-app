import { Data } from 'base/queries/txInfos';
import { TxResult } from '@terra-money/wallet-provider';

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
