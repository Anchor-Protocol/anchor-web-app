import { bluna } from '@anchor-protocol/types';
import { Dec, Int } from '@terra-money/terra.js';

test('claimable rewards error case 1', () => {
  const data = {
    data: {
      claimableReward: {
        Result:
          '{"address":"terra1zaj0537x67s9vjtg06d2xu0fagvnqacrecq0zd","balance":"240000000","index":"0","pending_rewards":"0"}',
        __typename: 'GetWasmContractsContractAddressStorePayload',
      },
      rewardState: {
        Result:
          '{"global_index":"0.000296123088000163","prev_reward_balance":"167155725","total_balance":"2304038168802"}',
        __typename: 'GetWasmContractsContractAddressStorePayload',
      },
    },
  };

  const holder: bluna.reward.HolderResponse = JSON.parse(
    data.data.claimableReward.Result,
  );
  const state: bluna.reward.StateResponse = JSON.parse(
    data.data.rewardState.Result,
  );

  console.log(
    'claimableRewards.test.ts..()',
    new Int(
      new Int(holder.balance).mul(
        new Dec(state.global_index).sub(new Dec(holder.index)),
      ),
    )
      .add(new Int(holder.pending_rewards))
      .toString(),
  );
});
