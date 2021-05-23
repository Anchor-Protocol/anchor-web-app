import {
  HumanAddr,
  moneyMarket,
  uaUST,
  uUST,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';
import big from 'big.js';
import { AnchorTokenBalances } from '../../types';

export interface EarnTotalDepositRawData {
  epochState: WASMContractResult;
}

export interface EarnTotalDepositData {
  epochState: WASMContractResult<moneyMarket.market.EpochStateResponse>;
  uaUST: uaUST;
  totalDeposit: uUST;
}

export interface EarnTotalDepositRawVariables {
  moneyMarketContract: string;
  epochStateQuery: string;
}

export interface EarnTotalDepositVariables {
  moneyMarketContract: HumanAddr;
  epochStateQuery: moneyMarket.market.EpochState;
}

// language=graphql
export const EARN_TOTAL_DEPOSIT_QUERY = `
  query (
    $moneyMarketContract: String!
    $epochStateQuery: String!
  ) {
    epochState: WasmContractsContractAddressStore(
      ContractAddress: $moneyMarketContract
      QueryMsg: $epochStateQuery
    ) {
      Result
    }
  }
`;

export interface EarnTotalDepositQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: EarnTotalDepositVariables;
  fetchTokenBalances: () => Promise<AnchorTokenBalances>;
  lastSyncedHeight: () => Promise<number>;
}

export async function earnTotalDepositQuery({
  mantleFetch,
  mantleEndpoint,
  variables,
  fetchTokenBalances,
  lastSyncedHeight,
}: EarnTotalDepositQueryParams): Promise<EarnTotalDepositData> {
  const { uaUST } = await fetchTokenBalances();
  const blockHeight = await lastSyncedHeight();

  variables.epochStateQuery.epoch_state.block_height = blockHeight + 1;

  const data = await mantleFetch<
    EarnTotalDepositRawVariables,
    EarnTotalDepositRawData
  >(
    EARN_TOTAL_DEPOSIT_QUERY,
    {
      moneyMarketContract: variables.moneyMarketContract,
      epochStateQuery: JSON.stringify(variables.epochStateQuery),
    },
    `${mantleEndpoint}?earn--total-deposit`,
  );

  const epochState = JSON.parse(data.epochState.Result);

  const totalDeposit = big(uaUST)
    .mul(epochState?.exchange_rate ?? '1')
    .toString() as uUST;

  return {
    epochState,
    uaUST,
    totalDeposit,
  };
}
