import type { ubLuna } from '@anchor-protocol/types';
import { map } from '@anchor-protocol/use-map';
import { testAddress, testClient } from 'test.env';
import {
  Data,
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../simulation';

describe('queries/terraswapOfferSimulation', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<Omit<RawData, 'deps'>, RawVariables>({
        query,
        variables: mapVariables({
          terraswapPair: testAddress.terraswap.blunaLunaPair,
          simulationQuery: {
            simulation: {
              offer_asset: {
                info: {
                  token: {
                    contract_addr: testAddress.cw20.bLuna,
                  },
                },
                amount: '100' as ubLuna,
              },
            },
          },
        }),
      })
      .then(({ data }) => map<RawData, Data>(data, dataMap));

    expect(parseInt(data.simulation?.return_amount ?? '')).not.toBeNaN();
  });
});
