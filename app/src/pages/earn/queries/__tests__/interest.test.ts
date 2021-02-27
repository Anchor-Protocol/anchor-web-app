import { map } from '@anchor-protocol/use-map';
import { testAddressProvider, testClient } from 'test.env';
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
          overseerContract: testAddressProvider.overseer(''),
          overseerEpochState: {
            epoch_state: {},
          },
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(typeof data.marketStatus?.deposit_rate).toBe('string');
  });
});
