import {
  createOperationOptions,
  merge,
  OperationDependency,
  timeout,
} from '@terra-dev/broadcastable-operation';
import { HumanAddr } from '@anchor-protocol/types';
import { createOptions } from 'base/transactions/createOptions';
import { getTxInfo } from 'base/transactions/getTxInfo';
import { pickEmptyResult } from 'base/transactions/pickEmptyResult';
import { postContractMsg } from 'base/transactions/postContractMsg';
import { parseTxResult } from 'base/transactions/tx';
import { MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { Airdrop } from 'pages/airdrop/queries/useAirdrop';

export const airdropClaimOptions = createOperationOptions({
  id: 'airdrop/claim',
  //broadcastWhen: 'always',
  pipe: ({
    address: { airdrop: airdropContract },
    post,
    client,
    signal,
    fixedGas,
    gasFee,
    gasAdjustment,
  }: OperationDependency<{}>) => [
    ({ address, airdrop }: { address: HumanAddr; airdrop: Airdrop }) => {
      return [
        new MsgExecuteContract(address, airdropContract, {
          claim: airdrop,
        }),
      ] as MsgExecuteContract[];
    }, // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, fixedGas + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), 1000 * 60 * 20), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    merge(getTxInfo(client, signal), () => ({ fixedGas })), // -> { TxResult, TxInfo, fixedGas }
    pickEmptyResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
