import { AddressProvider } from '@anchor-protocol/anchor.js';
import { createHookMsg } from '@anchor-protocol/anchor.js/dist/utils/cw20/create-hook-msg';
import { validateInput } from '@anchor-protocol/anchor.js/dist/utils/validate-input';
import { validateAddress } from '@anchor-protocol/anchor.js/dist/utils/validation/address';
import {
  validateIsGreaterThanZero,
  validateIsNumber,
} from '@anchor-protocol/anchor.js/dist/utils/validation/number';
import {
  createOperationOptions,
  merge,
  OperationDependency,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { Dec, Int, MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { Bank } from 'contexts/bank';
import { pickSellResult } from 'pages/gov/transactions/pickSellResult';
import { createContractMsg } from 'transactions/createContractMsg';
import { createOptions } from 'transactions/createOptions';
import { getTxInfo } from 'transactions/getTxInfo';
import { postContractMsg } from 'transactions/postContractMsg';
import { parseTxResult } from 'transactions/tx';

export const sellOptions = createOperationOptions({
  id: 'gov/sell',
  //broadcastWhen: 'always',
  pipe: ({
    addressProvider,
    post,
    client,
    signal,
    fixedGas,
    gasFee,
    gasAdjustment,
    bank,
  }: OperationDependency<{ bank: Bank }>) => [
    fabricatebSell, // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, fixedGas + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), 1000 * 60 * 20), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    merge(
      getTxInfo(client, signal), // -> { TxResult, TxInfo }
      () => ({
        fixedGas,
        bank,
      }), // -> { fixedGas }
    ),
    pickSellResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});

interface Option {
  address: string;
  amount: string;
  to?: string;
  beliefPrice?: string;
  maxSpread?: string;
}

export const fabricatebSell = ({
  address,
  amount,
  to,
  beliefPrice,
  maxSpread,
}: Option) => (addressProvider: AddressProvider): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    validateIsNumber(amount),
    validateIsGreaterThanZero(+amount),
  ]);

  const ancTokenAddress = addressProvider.ANC();
  const pairAddress = addressProvider.terraswapAncUstPair();

  return [
    new MsgExecuteContract(address, ancTokenAddress, {
      send: {
        contract: pairAddress,
        amount: new Int(new Dec(amount).mul(1000000)).toString(),
        msg: createHookMsg({
          swap: {
            belief_price: beliefPrice,
            max_spread: maxSpread,
            to: to,
          },
        }),
      },
    }),
  ];
};
