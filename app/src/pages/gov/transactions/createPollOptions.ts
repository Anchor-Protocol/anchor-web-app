import { AddressProvider } from '@anchor-protocol/anchor.js';
import { createHookMsg } from '@anchor-protocol/anchor.js/dist/utils/cw20/create-hook-msg';
import { validateInput } from '@anchor-protocol/anchor.js/dist/utils/validate-input';
import { validateAddress } from '@anchor-protocol/anchor.js/dist/utils/validation/address';
import { floor } from '@anchor-protocol/big-math';
import {
  createOperationOptions,
  effect,
  merge,
  OperationDependency,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { Dec, Int, MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { createContractMsg } from 'transactions/createContractMsg';
import { createOptions } from 'transactions/createOptions';
import { getTxInfo } from 'transactions/getTxInfo';
import { pickEmptyResult } from 'transactions/pickEmptyResult';
import { postContractMsg } from 'transactions/postContractMsg';
import { injectTxFee, takeTxFee } from 'transactions/takeTxFee';
import { parseTxResult } from 'transactions/tx';

export const createPollOptions = createOperationOptions({
  id: 'gov/create-poll',
  pipe: ({
    addressProvider,
    post,
    client,
    storage,
    signal,
    gasFee,
    gasAdjustment,
  }: OperationDependency<{}>) => [
    effect(fabricateGovCreatePoll, takeTxFee(storage)), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, floor(storage.get('txFee')) + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), 1000 * 60 * 2), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    merge(
      getTxInfo(client, signal), // -> { TxResult, TxInfo }
      injectTxFee(storage), // -> { txFee }
    ),
    pickEmptyResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});

export interface ExecuteMsg {
  order: number;
  contract: string;
  msg: string;
}

interface Option {
  address: string;
  amount: string;
  title: string;
  description: string;
  link?: string;
  execute_msgs?: ExecuteMsg[];
}

export const fabricateGovCreatePoll = ({
  address,
  amount,
  title,
  description,
  link,
  execute_msgs,
}: Option) => (addressProvider: AddressProvider): MsgExecuteContract[] => {
  validateInput([validateAddress(address)]);

  const anchorToken = addressProvider.ANC();

  return [
    new MsgExecuteContract(address, anchorToken, {
      send: {
        contract: addressProvider.gov(),
        amount: new Int(new Dec(amount).mul(1000000)).toString(),
        msg: createHookMsg({
          create_poll: {
            title,
            description,
            link,
            execute_msgs,
          },
        }),
      },
    }),
  ];
};
