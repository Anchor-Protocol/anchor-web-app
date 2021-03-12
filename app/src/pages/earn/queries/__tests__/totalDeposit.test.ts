import { map } from '@terra-dev/use-map';
import {
  testAddress,
  testClient,
  testWalletAddress,
} from '@anchor-protocol/web-contexts/test.env';
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
          anchorTokenContract: testAddress.cw20.aUST,
          anchorTokenBalanceQuery: {
            balance: {
              address: testWalletAddress,
            },
          },
          moneyMarketContract: testAddress.moneyMarket.market,
          moneyMarketEpochQuery: {
            epoch_state: {
              block_height: 0,
            },
          },
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(data.aUSTBalance).not.toBeUndefined();
    expect(data.exchangeRate).not.toBeUndefined();
  });
});
