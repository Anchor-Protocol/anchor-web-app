import { JSDateTime } from '@anchor-protocol/notation';
import { map } from '@anchor-protocol/use-map';
import { testClient, testWalletAddress } from 'test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../interestEarned';
import { sub } from 'date-fns';

describe('queries/interestEarned', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          walletAddress: testWalletAddress,
          now: Date.now() as JSDateTime,
          then: sub(Date.now(), { years: 10 }).getTime() as JSDateTime,
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(
      data.interestEarned && Number.isNaN(+data.interestEarned),
    ).toBeFalsy();
  });
});
