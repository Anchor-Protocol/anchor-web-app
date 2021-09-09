import { moneyMarket } from '@anchor-protocol/types';
import { mantle, MantleParams, WasmQuery, WasmQueryData } from '@libs/mantle';

export interface RewardsUstBorrowRewardsWasmQuery {
  borrowerInfo: WasmQuery<
    moneyMarket.market.BorrowerInfo,
    moneyMarket.market.BorrowerInfoResponse
  >;
  marketState: WasmQuery<
    moneyMarket.market.State,
    moneyMarket.market.StateResponse
  >;
}

export type RewardsUstBorrowRewards =
  WasmQueryData<RewardsUstBorrowRewardsWasmQuery>;

export type RewardsUstBorrowRewardsQueryParams = Omit<
  MantleParams<RewardsUstBorrowRewardsWasmQuery>,
  'query' | 'variables'
>;

//export interface RewardsUstBorrowRewardsRawData {
//  borrowerInfo: WASMContractResult;
//  marketState: WASMContractResult;
//}
//
//export interface RewardsUstBorrowRewardsData {
//  borrowerInfo: moneyMarket.market.BorrowerInfoResponse;
//  marketState: moneyMarket.market.StateResponse;
//}
//
//export interface RewardsUstBorrowRewardsRawVariables {
//  marketContract: string;
//  borrowerInfoQuery: string;
//  marketStateQuery: string;
//}
//
//export interface RewardsUstBorrowRewardsVariables {
//  marketContract: HumanAddr;
//  borrowerInfoQuery: moneyMarket.market.BorrowerInfo;
//  marketStateQuery: moneyMarket.market.State;
//}
//
//// language=graphql
//export const REWARDS_UST_BORROW_REWARDS_QUERY = `
//  query (
//    $marketContract: String!
//    $borrowerInfoQuery: String!
//    $marketStateQuery: String!
//  ) {
//    borrowerInfo: WasmContractsContractAddressStore(
//      ContractAddress: $marketContract
//      QueryMsg: $borrowerInfoQuery
//    ) {
//      Result
//    }
//
//    marketState: WasmContractsContractAddressStore(
//      ContractAddress: $marketContract
//      QueryMsg: $marketStateQuery
//    ) {
//      Result
//    }
//  }
//`;
//
//export interface RewardsUstBorrowRewardsQueryParams {
//  mantleEndpoint: string;
//  mantleFetch: MantleFetch;
//  variables: RewardsUstBorrowRewardsVariables;
//}

export async function rewardsUstBorrowRewardsQuery({
  mantleEndpoint,
  ...params
}: RewardsUstBorrowRewardsQueryParams): Promise<RewardsUstBorrowRewards> {
  return mantle<RewardsUstBorrowRewardsWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?rewards--ust-borrow-rewards`,
    variables: {},
    ...params,
  });
  //const rawData = await mantleFetch<
  //  RewardsUstBorrowRewardsRawVariables,
  //  RewardsUstBorrowRewardsRawData
  //>(
  //  REWARDS_UST_BORROW_REWARDS_QUERY,
  //  {
  //    marketContract: variables.marketContract,
  //    borrowerInfoQuery: JSON.stringify(variables.borrowerInfoQuery),
  //    marketStateQuery: JSON.stringify(variables.marketStateQuery),
  //  },
  //  `${mantleEndpoint}?rewards--ust-borrow-rewards`,
  //);
  //
  //return {
  //  borrowerInfo: JSON.parse(rawData.borrowerInfo.Result),
  //  marketState: JSON.parse(rawData.marketState.Result),
  //};
}
