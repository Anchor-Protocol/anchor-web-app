import { borrowAPYQuery } from '../apy';

describe('queries/borrowAPY', () => {
  test('should get result from query', async () => {
    const { borrowerDistributionAPYs, lpRewards, govRewards } =
      await borrowAPYQuery(
        'https://api-testnet.anchorprotocol.com/api',
        'terra13r3vngakfw457dwhw9ef36mc8w6agggefe70d9',
      );

    expect(Array.isArray(borrowerDistributionAPYs)).toBeTruthy();
    expect(Array.isArray(govRewards)).toBeTruthy();
    expect(Array.isArray(lpRewards)).toBeTruthy();
  });
});
