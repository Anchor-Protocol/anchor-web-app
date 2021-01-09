import { testAddressProvider, testClient } from 'test.env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../interest';

describe('queries/totalDeposit', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          overseerContract: testAddressProvider.overseer(),
          overseerEpochState: {
            epoch_state: {},
          },
        }),
      })
      .then(({ data }) => parseData(data));

    expect(typeof data.marketStatus.deposit_rate).toBe('string');
  });
});
