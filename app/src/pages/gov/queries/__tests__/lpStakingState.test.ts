import { map } from '@anchor-protocol/use-map';
import { testAddressProvider, testClient } from 'test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../lpStakingState';

describe('queries/lpStakingState', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          ANCUST_LP_Staking_contract: testAddressProvider.staking(),
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(typeof data.lpStakingState?.total_bond_amount).toBe('string');
  });
});
