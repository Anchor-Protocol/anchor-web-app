import { AddressProvider } from '@anchor-protocol/anchor.js';
import { validateInput } from '@anchor-protocol/anchor.js/dist/utils/validate-input';
import { validateAddress } from '@anchor-protocol/anchor.js/dist/utils/validation/address';
import {
  validateIsGreaterThanZero,
  validateIsNumber,
} from '@anchor-protocol/anchor.js/dist/utils/validation/number';
import { floor } from '@terra-dev/big-math';
import {
  createOperationOptions,
  effect,
  merge,
  OperationDependency,
  timeout,
} from '@terra-dev/broadcastable-operation';
import {
  Coin,
  Coins,
  Dec,
  Int,
  MsgExecuteContract,
  StdFee,
} from '@terra-money/terra.js';
import { Bank } from 'base/contexts/bank';
import { createContractMsg } from 'base/transactions/createContractMsg';
import { createOptions } from 'base/transactions/createOptions';
import { getTxInfo } from 'base/transactions/getTxInfo';
import { postContractMsg } from 'base/transactions/postContractMsg';
import { takeTxFee } from 'base/transactions/takeTxFee';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { pickBuyResult } from 'pages/gov/transactions/pickBuyResult';

export const buyOptions = createOperationOptions({
  id: 'gov/buy',
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
    storage,
  }: OperationDependency<{ bank: Bank }>) => [
    effect(fabricatebBuy, takeTxFee(storage)), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, floor(storage.get('txFee')) + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), 1000 * 60 * 20), // -> Promise<TxResult>
    merge(
      getTxInfo(client, signal), // -> { TxResult, TxInfo }
      () => ({
        fixedGas,
        bank,
      }), // -> { fixedGas }
    ),
    pickBuyResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});

interface Option {
  address: string;
  amount: string;
  denom: string;
  to?: string;
  beliefPrice?: string;
  maxSpread?: string;
}

export const fabricatebBuy = ({
  address,
  amount,
  to,
  beliefPrice,
  maxSpread,
  denom,
}: Option) => (addressProvider: AddressProvider): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    validateIsNumber(amount),
    validateIsGreaterThanZero(+amount),
  ]);

  const coins = new Coins([
    new Coin(denom, new Int(new Dec(amount).mul(1000000)).toString()),
  ]);
  const pairAddress = addressProvider.terraswapAncUstPair();
  return [
    new MsgExecuteContract(
      address,
      pairAddress,
      {
        swap: {
          offer_asset: {
            info: {
              native_token: {
                denom: denom,
              },
            },
            amount: new Int(new Dec(amount).mul(1000000)).toString(),
          },
          belief_price: beliefPrice,
          max_spread: maxSpread,
          to: to,
        },
      },
      coins,
    ),
  ];
};
