import type { Denom, uLuna } from '@anchor-protocol/types';
import { map } from '@anchor-protocol/use-map';
import { testAddress, testClient } from 'test.env';
import {
  Data,
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../terraswapAskSimulation';

describe('queries/terraswapOfferSimulation', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          terraswapPair: testAddress.terraswap.blunaLunaPair,
          askSimulationQuery: {
            simulation: {
              offer_asset: {
                info: {
                  native_token: {
                    denom: 'uluna' as Denom,
                  },
                },
                amount: '100' as uLuna,
              },
            },
          },
        }),
      })
      .then(({ data }) => map<RawData, Data>(data, dataMap));

    expect(
      parseInt(data.terraswapAskSimulation?.return_amount ?? ''),
    ).not.toBeNaN();
  });
});
