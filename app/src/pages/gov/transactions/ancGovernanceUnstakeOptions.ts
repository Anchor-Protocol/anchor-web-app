//import { fabricateStakingBond } from '@anchor-protocol/anchor.js';
import { AddressProvider } from '@anchor-protocol/anchor.js';
import { validateInput } from '@anchor-protocol/anchor.js/dist/utils/validate-input';
import { validateAddress } from '@anchor-protocol/anchor.js/dist/utils/validation/address';
import {
  createOperationOptions,
  merge,
  OperationDependency,
  timeout,
} from '@terra-dev/broadcastable-operation';
import { Dec, Int, MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import { createContractMsg } from 'base/transactions/createContractMsg';
import { createOptions } from 'base/transactions/createOptions';
import { getTxInfo } from 'base/transactions/getTxInfo';
import { postContractMsg } from 'base/transactions/postContractMsg';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { pickAncGovernanceStakeResult } from 'pages/gov/transactions/pickAncGovernanceStakeResult';

export const ancGovernanceUnstakeOptions = createOperationOptions({
  id: 'gov/ancGovernanceUnstake',
  //broadcastWhen: 'always',
  pipe: ({
    addressProvider,
    post,
    client,
    signal,
    fixedGas,
    gasFee,
    gasAdjustment,
  }: OperationDependency<{}>) => [
    fabricateGovWithdrawVotingTokens, // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, fixedGas + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), 1000 * 60 * 20), // -> Promise<TxResult>
    merge(getTxInfo(client, signal), () => ({ fixedGas })), // -> { TxResult, TxInfo, fixedGas }
    pickAncGovernanceStakeResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});

interface Option {
  address: string;
  amount?: string;
}

export const fabricateGovWithdrawVotingTokens = ({
  address,
  amount,
}: Option) => (addressProvider: AddressProvider): MsgExecuteContract[] => {
  validateInput([validateAddress(address)]);

  const gov = addressProvider.gov();

  return [
    new MsgExecuteContract(address, gov, {
      withdraw_voting_tokens: {
        amount: amount
          ? new Int(new Dec(amount).mul(1000000)).toString()
          : undefined,
      },
    }),
  ];
};
