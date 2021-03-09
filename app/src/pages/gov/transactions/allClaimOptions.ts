import {
  fabricateMarketClaimRewards,
  fabricateStakingWithdraw,
} from '@anchor-protocol/anchor.js';
import {
  createOperationOptions,
  merge,
  OperationDependency,
  OperationStop,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { HumanAddr } from '@anchor-protocol/types';
import { MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { createOptions } from '@anchor-protocol/web-contexts/transactions/createOptions';
import { getTxInfo } from '@anchor-protocol/web-contexts/transactions/getTxInfo';
import { pickEmptyResult } from '@anchor-protocol/web-contexts/transactions/pickEmptyResult';
import { postContractMsg } from '@anchor-protocol/web-contexts/transactions/postContractMsg';
import { parseTxResult } from '@anchor-protocol/web-contexts/transactions/tx';

export const allClaimOptions = createOperationOptions({
  id: 'gov/allClaim',
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
    ({
      walletAddress,
      claimMoneyMarketRewards,
      cliamLpStakingRewards,
    }: {
      walletAddress: HumanAddr;
      claimMoneyMarketRewards: boolean;
      cliamLpStakingRewards: boolean;
    }): MsgExecuteContract[] => {
      const contracts: MsgExecuteContract[] = [];

      if (cliamLpStakingRewards) {
        contracts.push(
          ...fabricateStakingWithdraw({ address: walletAddress })(
            addressProvider,
          ),
        );
      }

      if (claimMoneyMarketRewards) {
        contracts.push(
          ...fabricateMarketClaimRewards({
            address: walletAddress,
            market: 'usd',
          })(addressProvider),
        );
      }

      if (contracts.length === 0) {
        throw new OperationStop();
      }

      return contracts;
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
