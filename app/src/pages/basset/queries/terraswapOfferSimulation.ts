import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider';
import { min } from '@anchor-protocol/big-math';
import {
  formatFluidDecimalPoints,
  Ratio,
  ubLuna,
  uLuna,
  uUST,
} from '@anchor-protocol/notation';
import { ApolloClient, ApolloQueryResult, gql } from '@apollo/client';
import big, { Big } from 'big.js';
import { Bank } from 'contexts/bank';
import { SwapSimulation } from 'pages/basset/models/swapSimulation';
import { Data as TaxData } from 'queries/tax';

export interface StringifiedData {
  terraswapOfferSimulation: {
    Result: string;
  };
}

export interface Data extends SwapSimulation {
  commission_amount: uLuna;
  return_amount: uLuna;
  spread_amount: uLuna;
}

export function parseData(
  { terraswapOfferSimulation }: StringifiedData,
  burnAmount: ubLuna,
  { taxRate, maxTaxUUSD }: TaxData,
): Data {
  const data = JSON.parse(terraswapOfferSimulation.Result) as Pick<
    Data,
    'commission_amount' | 'return_amount' | 'spread_amount'
  >;

  const beliefPrice = big(1).div(big(data.return_amount).div(burnAmount));
  const maxSpread = 0.1;

  const tax = min(
    big(burnAmount).mul(beliefPrice).mul(taxRate),
    maxTaxUUSD,
  ) as uUST<Big>;
  const expectedAmount = big(burnAmount).mul(beliefPrice).minus(tax);
  const rate = big(1).minus(maxSpread);
  const minimumReceived = expectedAmount.mul(rate).toFixed() as uLuna;
  const swapFee = big(data.commission_amount)
    .plus(data.spread_amount)
    .toFixed() as uLuna;

  return {
    ...data,
    minimumReceived,
    swapFee,
    beliefPrice: formatFluidDecimalPoints(beliefPrice, 18, {
      fallbackValue: '0',
    }) as Ratio,
    maxSpread: maxSpread.toString() as Ratio,

    lunaAmount: big(burnAmount).mul(beliefPrice).toString() as uLuna,
  };
}

export interface StringifiedVariables {
  bLunaTerraswap: string;
  offerSimulationQuery: string;
}

export interface Variables {
  bLunaTerraswap: string;
  offerSimulationQuery: {
    simulation: {
      offer_asset: {
        info: {
          token: {
            contract_addr: string;
          };
        };
        amount: ubLuna;
      };
    };
  };
}

export function stringifyVariables({
  bLunaTerraswap,
  offerSimulationQuery,
}: Variables): StringifiedVariables {
  return {
    bLunaTerraswap,
    offerSimulationQuery: JSON.stringify(offerSimulationQuery),
  };
}

export const query = gql`
  query($bLunaTerraswap: String!, $offerSimulationQuery: String!) {
    terraswapOfferSimulation: WasmContractsContractAddressStore(
      ContractAddress: $bLunaTerraswap
      QueryMsg: $offerSimulationQuery
    ) {
      Result
    }
  }
`;

export function queryTerraswapOfferSimulation(
  client: ApolloClient<any>,
  addressProvider: AddressProvider,
  burnAmount: ubLuna,
  bank: Bank,
): Promise<ApolloQueryResult<StringifiedData> & { parsedData: Data }> {
  return client
    .query<StringifiedData, StringifiedVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: stringifyVariables({
        bLunaTerraswap: addressProvider.blunaBurnPair(),
        offerSimulationQuery: {
          simulation: {
            offer_asset: {
              info: {
                token: {
                  contract_addr: addressProvider.bAssetToken('bluna'),
                },
              },
              amount: burnAmount,
            },
          },
        },
      }),
    })
    .then((result) => {
      return {
        ...result,
        parsedData: parseData(result.data, burnAmount, bank.tax),
      };
    });
}
