import {
  TEST_ADDRESSES,
  TEST_WALLET_ADDRESS,
} from '@anchor-protocol/app-fns/test-env';
import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { bLunaWithdrawableAmountQuery } from '../bLunaWithdrawableAmount';

describe('queries/withdrawable', () => {
  test('should get result from query', async () => {
    const result = await bLunaWithdrawableAmountQuery(
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
