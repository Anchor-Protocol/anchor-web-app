import { Ratio, ubLuna, uUST } from '@anchor-protocol/notation';
import { map } from '@anchor-protocol/use-map';
import { offerSimulation } from 'pages/basset/logics/offerSimulation';
import { testAddressProvider, testClient } from 'test.env';
import {
  Data,
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../terraswapOfferSimulation';

describe('queries/terraswapOfferSimulation', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<Omit<RawData, 'deps'>, RawVariables>({
        query,
        variables: mapVariables({
          bLunaTerraswap: testAddressProvider.terraswapblunaLunaPair(),
          offerSimulationQuery: {
            simulation: {
              offer_asset: {
                info: {
                  token: {
                    contract_addr: testAddressProvider.blunaToken(),
                  },
                },
                amount: '100' as ubLuna,
              },
            },
          },
        }),
      })
      .then(({ data }) => map<RawData, Data>(data, dataMap))
      .then(({ terraswapOfferSimulation }) =>
        offerSimulation(
          terraswapOfferSimulation!.commission_amount,
          terraswapOfferSimulation!.return_amount,
          terraswapOfferSimulation!.spread_amount,
          '100' as ubLuna,
          {
            taxRate: '1' as Ratio,
            maxTaxUUSD: '3500000' as uUST,
          },
        ),
      );

    expect(parseInt(data.return_amount)).not.toBeNaN();
  });
});
