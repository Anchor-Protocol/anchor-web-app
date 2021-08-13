import { TxResult } from '@terra-dev/wallet-types';
import {
  MantleFetch,
  pollTxInfo,
  TxInfoData,
  TxResultRendering,
  TxStreamPhase,
} from '@terra-money/webapp-fns';
import { TxHelper } from './TxHelper';

interface Params {
  helper: TxHelper;
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  onTxSucceed?: () => void;
}

export function _pollTxInfo({
  helper,
  mantleEndpoint,
  mantleFetch,
  onTxSucceed,
}: Params) {
  return ({ value: txResult }: TxResultRendering<TxResult>) => {
    return pollTxInfo({
      mantleEndpoint,
      mantleFetch,
      tx: helper.savedTx,
      txhash: txResult.result.txhash,
    }).then((txInfo) => {
      onTxSucceed?.();

      return {
        value: txInfo,

        phase: TxStreamPhase.SUCCEED,
        receipts: [helper.txHashReceipt(), helper.txFeeReceipt()],
      } as TxResultRendering<TxInfoData>;
    });
  };
}
