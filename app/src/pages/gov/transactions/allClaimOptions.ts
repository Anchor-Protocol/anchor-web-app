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
} from '@terra-dev/broadcastable-operation';
import { HumanAddr } from '@anchor-protocol/types';
import { createOptions } from 'base/transactions/createOptions';
import { getTxInfo } from 'base/transactions/getTxInfo';
import { postContractMsg } from 'base/transactions/postContractMsg';
import { parseTxResult } from 'base/transactions/tx';
import { MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { OPERATION_TIMEOUT } from 'env';
import { pickAllClaimResult } from 'pages/gov/transactions/pickAllClaimResult';

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
    timeout(postContractMsg(post), OPERATION_TIMEOUT), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    merge(getTxInfo(client, signal), () => ({ fixedGas })), // -> { TxResult, TxInfo, fixedGas }
    pickAllClaimResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
