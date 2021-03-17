import { map } from '@terra-dev/use-map';
import { testAddress, testClient } from 'base/test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../validators';

describe('queries/validators', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          bLunaHubContract: testAddress.bluna.hub,
          whitelistedValidatorsQuery: {
            whitelisted_validators: {},
          },
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(Array.isArray(data.validators)).toBeTruthy();
    expect(Array.isArray(data.whitelistedValidators)).toBeTruthy();
  });
});
