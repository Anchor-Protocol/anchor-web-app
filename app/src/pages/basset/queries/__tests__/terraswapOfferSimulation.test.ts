import { Ratio, ubLuna, uUST } from '@anchor-protocol/notation';
import { testAddressProvider, testClient } from 'test.env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../terraswapOfferSimulation';

describe('queries/terraswapOfferSimulation', () => {
  test('xxx', () => {
    console.log(
      'terraswapOfferSimulation.test.ts..()',
      JSON.stringify(
        JSON.parse(
          '{"simulation":{"offer_asset":{"info":{"token":{"contract_addr":"terra12kz7ehjh9m2aexmyumlt29qjuc9j5mjcdp0d5k"}},"amount":"user_input"}}}',
        ),
        null,
        2,
      ),
    );
  });

  test('should get result from query', async () => {
    const data = await testClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          bLunaTerraswap: testAddressProvider.blunaBurnPair(),
          offerSimulationQuery: {
            simulation: {
              offer_asset: {
                info: {
                  token: {
                    contract_addr: testAddressProvider.bAssetToken('bluna'),
                  },
                },
                amount: '100' as ubLuna,
              },
            },
          },
        }),
      })
      .then(({ data }) =>
        parseData(data, '100' as ubLuna, {
          taxRate: '1' as Ratio,
          maxTaxUUSD: '3500000' as uUST,
        }),
      );

    expect(+data.return_amount).not.toBeNaN();
  });
});
