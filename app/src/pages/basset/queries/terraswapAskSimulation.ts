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
  terraswapAskSimulation: {
    Result: string;
  };
}

export interface Data extends SwapSimulation {
  commission_amount: uLuna;
  return_amount: uLuna;
  spread_amount: uLuna;
}

export function parseData(
  { terraswapAskSimulation }: StringifiedData,
  getAmount: uLuna,
  { taxRate, maxTaxUUSD }: TaxData,
): Data {
  const data = JSON.parse(terraswapAskSimulation.Result) as Pick<
    Data,
    'commission_amount' | 'return_amount' | 'spread_amount'
  >;

  const beliefPrice = big(data.return_amount).div(getAmount);
  const maxSpread = 0.1;

  const tax = min(
    big(getAmount)
      .div(beliefPrice)
      .div(1 + taxRate),
    maxTaxUUSD,
  ) as uUST<Big>;
  const expectedAmount = big(getAmount).div(beliefPrice).minus(tax);
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

    bLunaAmount: big(getAmount).div(beliefPrice).toString() as ubLuna,
  };
}

export interface StringifiedVariables {
  bLunaTerraswap: string;
  askSimulationQuery: string;
}

export interface Variables {
  bLunaTerraswap: string;
  askSimulationQuery: {
    simulation: {
      offer_asset: {
        info: {
          native_token: {
            denom: 'uluna';
          };
        };
        amount: uLuna;
      };
    };
  };
}

export function stringifyVariables({
  bLunaTerraswap,
  askSimulationQuery,
}: Variables): StringifiedVariables {
  return {
    bLunaTerraswap,
    askSimulationQuery: JSON.stringify(askSimulationQuery),
  };
}

export const query = gql`
  query($bLunaTerraswap: String!, $askSimulationQuery: String!) {
    terraswapAskSimulation: WasmContractsContractAddressStore(
      ContractAddress: $bLunaTerraswap
      QueryMsg: $askSimulationQuery
    ) {
      Result
    }
  }
`;

export function queryTerraswapAskSimulation(
  client: ApolloClient<any>,
  addressProvider: AddressProvider,
  getAmount: uLuna,
  bank: Bank,
): Promise<ApolloQueryResult<StringifiedData> & { parsedData: Data }> {
  return client
    .query<StringifiedData, StringifiedVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: stringifyVariables({
        bLunaTerraswap: addressProvider.blunaBurnPair(),
        askSimulationQuery: {
          simulation: {
            offer_asset: {
              info: {
                native_token: {
                  denom: 'uluna',
                },
              },
              amount: getAmount,
            },
          },
        },
      }),
    })
    .then((result) => {
      return {
        ...result,
        parsedData: parseData(result.data, getAmount, bank.tax),
      };
    });
}
