import { HumanAddr } from '@anchor-protocol/types';
import {
  createOperationOptions,
  merge,
  OperationDependency,
  timeout,
} from '@terra-dev/broadcastable-operation';
import { MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import { createOptions } from 'base/transactions/createOptions';
import { getTxInfo } from 'base/transactions/getTxInfo';
import { pickEmptyResult } from 'base/transactions/pickEmptyResult';
import { postContractMsg } from 'base/transactions/postContractMsg';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { Airdrop } from 'pages/airdrop/queries/useAirdrop';

export const airdropClaimOptions = createOperationOptions({
  id: 'airdrop/claim',
  //broadcastWhen: 'always',
  pipe: ({
    address: contractAddress,
    post,
    client,
    signal,
    fixedGas,
    gasFee,
    gasAdjustment,
  }: OperationDependency<{}>) => [
    ({ address, airdrop }: { address: HumanAddr; airdrop: Airdrop }) => {
      return [
        new MsgExecuteContract(address, contractAddress.bluna.airdropRegistry, {
          claim: {
            stage: airdrop.stage,
            amount: airdrop.amount.toString(),
            proof: JSON.parse(airdrop.proof),
          },
        }),
      ] as MsgExecuteContract[];
    }, // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, fixedGas + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), 1000 * 60 * 20), // -> Promise<TxResult>
    merge(getTxInfo(client, signal), () => ({ fixedGas })), // -> { TxResult, TxInfo, fixedGas }
    pickEmptyResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
