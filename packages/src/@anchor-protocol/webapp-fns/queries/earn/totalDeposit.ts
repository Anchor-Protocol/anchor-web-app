import {
  cw20,
  CW20Addr,
  HumanAddr,
  moneyMarket,
  uaUST,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface EarnTotalDepositRawData {
  aUSTBalance: WASMContractResult;
  exchangeRate: WASMContractResult;
}

export interface EarnTotalDepositData {
  aUSTBalance: WASMContractResult<cw20.BalanceResponse<uaUST>>;
  exchangeRate: WASMContractResult<moneyMarket.market.EpochStateResponse>;
}

export interface EarnTotalDepositRawVariables {
  anchorTokenContract: string;
  anchorTokenBalanceQuery: string;
  moneyMarketContract: string;
  moneyMarketEpochQuery: string;
}

export interface EarnTotalDepositVariables {
  anchorTokenContract: CW20Addr;
  anchorTokenBalanceQuery: cw20.Balance;
  moneyMarketContract: HumanAddr;
  moneyMarketEpochQuery: moneyMarket.market.EpochState;
}

// language=graphql
export const EARN_TOTAL_DEPOSIT_QUERY = `
  query (
    $anchorTokenContract: String!
    $anchorTokenBalanceQuery: String!
    $moneyMarketContract: String!
    $moneyMarketEpochQuery: String!
  ) {
    aUSTBalance: WasmContractsContractAddressStore(
      ContractAddress: $anchorTokenContract
      QueryMsg: $anchorTokenBalanceQuery
    ) {
      Result
    }

    exchangeRate: WasmContractsContractAddressStore(
      ContractAddress: $moneyMarketContract
      QueryMsg: $moneyMarketEpochQuery
    ) {
      Result
    }
  }
`;

export interface EarnTotalDepositQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: EarnTotalDepositVariables;
  lastSyncedHeight: () => Promise<number>;
}

export async function earnTotalDepositQuery({
  mantleFetch,
  mantleEndpoint,
  variables,
  lastSyncedHeight,
}: EarnTotalDepositQueryParams): Promise<EarnTotalDepositData> {
  variables.moneyMarketEpochQuery.epoch_state.block_height =
    (await lastSyncedHeight()) + 1;

  const data = await mantleFetch<
    EarnTotalDepositRawVariables,
    EarnTotalDepositRawData
  >(
    EARN_TOTAL_DEPOSIT_QUERY,
    {
      anchorTokenContract: variables.anchorTokenContract,
      anchorTokenBalanceQuery: JSON.stringify(
        variables.anchorTokenBalanceQuery,
      ),
      moneyMarketContract: variables.moneyMarketContract,
      moneyMarketEpochQuery: JSON.stringify(variables.moneyMarketEpochQuery),
    },
    mantleEndpoint + '?earn--total-deposit',
  );

  return {
    aUSTBalance: JSON.parse(data.aUSTBalance.Result),
    exchangeRate: JSON.parse(data.exchangeRate.Result),
  };
}
