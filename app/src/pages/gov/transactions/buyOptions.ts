import { AddressProvider } from '@anchor-protocol/anchor.js';
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
} from '@terra-dev/broadcastable-operation';
import {
  Coin,
  Coins,
  Dec,
  Int,
  MsgExecuteContract,
  StdFee,
} from '@terra-money/terra.js';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { Bank } from '@anchor-protocol/web-contexts/contexts/bank';
import { pickBuyResult } from 'pages/gov/transactions/pickBuyResult';
import { createContractMsg } from '@anchor-protocol/web-contexts/transactions/createContractMsg';
import { createOptions } from '@anchor-protocol/web-contexts/transactions/createOptions';
import { getTxInfo } from '@anchor-protocol/web-contexts/transactions/getTxInfo';
import { postContractMsg } from '@anchor-protocol/web-contexts/transactions/postContractMsg';
import { parseTxResult } from '@anchor-protocol/web-contexts/transactions/tx';

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
  }: OperationDependency<{ bank: Bank }>) => [
    fabricatebBuy, // Option -> ((AddressProvider) -> MsgExecuteContract[])
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
