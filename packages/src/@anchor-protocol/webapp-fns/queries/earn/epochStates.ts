import {
  HumanAddr,
  moneyMarket,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface EarnEpochStatesRawData {
  moneyMarketEpochState: WASMContractResult;
  overseerEpochState: WASMContractResult;
}

export interface EarnEpochStatesData {
  moneyMarketEpochState: WASMContractResult<moneyMarket.market.EpochStateResponse>;
  overseerEpochState: WASMContractResult<moneyMarket.overseer.EpochStateResponse>;
}

export interface EarnEpochStatesRawVariables {
  moneyMarketContract: string;
  moneyMarketEpochStateQuery: string;
  overseerContract: string;
  overseerEpochStateQuery: string;
}

export interface EarnEpochStatesVariables {
  moneyMarketContract: HumanAddr;
  moneyMarketEpochStateQuery: moneyMarket.market.EpochState;
  overseerContract: HumanAddr;
  overseerEpochStateQuery: moneyMarket.overseer.EpochState;
}

// language=graphql
export const EARN_EPOCH_STATES_QUERY = `
  query (
    $moneyMarketContract: String!
    $moneyMarketEpochStateQuery: String!
    $overseerContract: String!
    $overseerEpochStateQuery: String!
  ) {
    moneyMarketEpochState: WasmContractsContractAddressStore(
      ContractAddress: $moneyMarketContract
      QueryMsg: $moneyMarketEpochStateQuery
    ) {
      Result
    }

    overseerEpochState: WasmContractsContractAddressStore(
      ContractAddress: $overseerContract
      QueryMsg: $overseerEpochStateQuery
    ) {
      Result
    }
  }
`;

export interface EarnEpochStatesQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: EarnEpochStatesVariables;
  lastSyncedHeight: () => Promise<number>;
}

export async function earnEpochStatesQuery({
  mantleFetch,
  mantleEndpoint,
  variables,
  lastSyncedHeight,
}: EarnEpochStatesQueryParams): Promise<EarnEpochStatesData> {
  const blockHeight = await lastSyncedHeight();

  variables.moneyMarketEpochStateQuery.epoch_state.block_height =
    blockHeight + 1;

  const rawData = await mantleFetch<
    EarnEpochStatesRawVariables,
    EarnEpochStatesRawData
  >(
    EARN_EPOCH_STATES_QUERY,
    {
      moneyMarketContract: variables.moneyMarketContract,
      moneyMarketEpochStateQuery: JSON.stringify(
        variables.moneyMarketEpochStateQuery,
      ),
      overseerContract: variables.overseerContract,
      overseerEpochStateQuery: JSON.stringify(
        variables.overseerEpochStateQuery,
      ),
    },
    `${mantleEndpoint}?earn--epoch-states`,
  );

  return {
    moneyMarketEpochState: JSON.parse(rawData.moneyMarketEpochState.Result),
    overseerEpochState: JSON.parse(rawData.overseerEpochState.Result),
  };
}
