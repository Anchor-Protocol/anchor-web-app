import { Ratio, uLuna, uUST } from '@anchor-protocol/notation';
import { map } from '@anchor-protocol/use-map';
import { askSimulation } from 'pages/basset/logics/askSimulation';
import { testAddressProvider, testClient } from 'test.env';
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
          bLunaTerraswap: testAddressProvider.blunaBurnPair(),
          askSimulationQuery: {
            simulation: {
              offer_asset: {
                info: {
                  native_token: {
                    denom: 'uluna',
                  },
                },
                amount: '100' as uLuna,
              },
            },
          },
        }),
      })
      .then(({ data }) => map<RawData, Data>(data, dataMap))
      .then(({ terraswapAskSimulation }) =>
        askSimulation(
          terraswapAskSimulation!.commission_amount,
          terraswapAskSimulation!.return_amount,
          terraswapAskSimulation!.spread_amount,
          '100' as uLuna,
          {
            taxRate: '1' as Ratio,
            maxTaxUUSD: '3500000' as uUST,
          },
        ),
      );

    expect(parseInt(data.return_amount)).not.toBeNaN();
  });
});
