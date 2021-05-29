import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
  TEST_WALLET_ADDRESS,
} from '@anchor-protocol/webapp-fns/test-env';
import { defaultMantleFetch } from '@terra-money/webapp-fns';
import { bondWithdrawableAmountQuery } from '../withdrawableAmount';

describe('queries/withdrawable', () => {
  test('should get result from query', async () => {
    const {
      unbondedRequests,
      unbondedRequestsStartFrom,
      withdrawableUnbonded,
      parameters,
      allHistory,
    } = await bondWithdrawableAmountQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      variables: {
        bLunaHubContract: TEST_ADDRESSES.bluna.hub,
        withdrawableUnbondedQuery: {
          withdrawable_unbonded: {
            address: TEST_WALLET_ADDRESS,
            block_time: Math.floor(Date.now() / 1000),
          },
        },
        unbondedRequestsQuery: {
          unbond_requests: {
            address: TEST_WALLET_ADDRESS,
          },
        },
        parametersQuery: {
          parameters: {},
        },
        allHistoryQuery: {
          all_history: {
            start_from: -1,
            limit: 100,
          },
        },
      },
    });

    expect(Array.isArray(unbondedRequests.requests)).toBeTruthy();
    expect(typeof unbondedRequestsStartFrom).toBe('number');
    expect(withdrawableUnbonded).not.toBeUndefined();
    expect(parameters).not.toBeUndefined();
    expect(Array.isArray(allHistory.history)).toBeTruthy();
  });
});
