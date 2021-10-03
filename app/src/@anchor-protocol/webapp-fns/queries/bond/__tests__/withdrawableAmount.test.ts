import {
  TEST_ADDRESSES,
  TEST_WALLET_ADDRESS,
} from '@anchor-protocol/webapp-fns/test-env';
import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { bondWithdrawableAmountQuery } from '../withdrawableAmount';

describe('queries/withdrawable', () => {
  test('should get result from query', async () => {
    const result = await bondWithdrawableAmountQuery(
      TEST_WALLET_ADDRESS,
      TEST_ADDRESSES.bluna.hub,
      TEST_LCD_CLIENT,
    );

    expect(Array.isArray(result?.unbondedRequests.requests)).toBeTruthy();
    expect(typeof result?.unbondedRequestsStartFrom).toBe('number');
    expect(result?.withdrawableUnbonded).not.toBeUndefined();
    //expect(parameters).not.toBeUndefined();
    expect(Array.isArray(result?.allHistory.history)).toBeTruthy();
  });
});
