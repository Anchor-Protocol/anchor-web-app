import { map } from '@anchor-protocol/use-map';
import { testAddressProvider, testClient, testWalletAddress } from 'test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../totalDeposit';

describe('queries/totalDeposit', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          anchorTokenContract: testAddressProvider.aTerra(),
          anchorTokenBalanceQuery: {
            balance: {
              address: testWalletAddress,
            },
          },
          moneyMarketContract: testAddressProvider.market(),
          moneyMarketEpochQuery: {
            epoch_state: {
              lastSyncedHeight: 0,
            },
          },
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(data.aUSTBalance).not.toBeUndefined();
    expect(data.exchangeRate).not.toBeUndefined();
  });
});
