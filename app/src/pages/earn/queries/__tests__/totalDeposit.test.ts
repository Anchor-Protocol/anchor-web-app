import { map } from '@terra-dev/use-map';
import { queryLastSyncedHeight } from 'base/queries/lastSyncedHeight';
import { testAddress, testClient, testWalletAddress } from 'base/test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../totalDeposit';

describe('queries/totalDeposit', () => {
  test('should get result from query', async () => {
    const { data: lastSyncedHeight } = await queryLastSyncedHeight(testClient);

    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          anchorTokenContract: testAddress.cw20.aUST,
          anchorTokenBalanceQuery: {
            balance: {
              address: testWalletAddress,
            },
          },
          moneyMarketContract: testAddress.moneyMarket.market,
          moneyMarketEpochQuery: {
            epoch_state: {
              block_height: lastSyncedHeight,
            },
          },
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(data.aUSTBalance).not.toBeUndefined();
    expect(data.exchangeRate).not.toBeUndefined();
  });
});
