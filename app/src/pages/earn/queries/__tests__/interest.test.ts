import { map } from '@anchor-protocol/use-map';
import {
  testAddress,
  testClient,
} from '@anchor-protocol/web-contexts/test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../interest';

describe('queries/totalDeposit', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          overseerContract: testAddress.moneyMarket.overseer,
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(typeof data.marketStatus?.deposit_rate).toBe('string');
  });
});
