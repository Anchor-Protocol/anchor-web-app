import {
  HumanAddr,
  moneyMarket,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface BorrowBorrowerRawData {
  marketBorrowerInfo: WASMContractResult;
  custodyBorrower: WASMContractResult;
}

export interface BorrowBorrowerData {
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse;
  custodyBorrower: moneyMarket.custody.BorrowerResponse;
  blockHeight: number;
}

export interface BorrowBorrowerRawVariables {
  marketContract: string;
  marketBorrowerInfoQuery: string;
  custodyContract: string;
  custodyBorrowerQuery: string;
}

export interface BorrowBorrowerVariables {
  marketContract: HumanAddr;
  marketBorrowerInfoQuery: moneyMarket.market.BorrowerInfo;
  custodyContract: HumanAddr;
  custodyBorrowerQuery: moneyMarket.custody.Borrower;
}

// language=graphql
export const BORROW_BORROWER_QUERY = `
  query(
    $marketContract: String!
    $marketBorrowerInfoQuery: String!
    $custodyContract: String!
    $custodyBorrowerQuery: String!
  ) {
    marketBorrowerInfo: WasmContractsContractAddressStore(
      ContractAddress: $marketContract
      QueryMsg: $marketBorrowerInfoQuery
    ) {
      Result
    }

    custodyBorrower: WasmContractsContractAddressStore(
      ContractAddress: $custodyContract
      QueryMsg: $custodyBorrowerQuery
    ) {
      Result
    }
  }
`;

export interface BorrowBorrowerQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: BorrowBorrowerVariables;
  lastSyncedHeight: () => Promise<number>;
}

export async function borrowBorrowerQuery({
  mantleFetch,
  mantleEndpoint,
  variables,
  lastSyncedHeight,
}: BorrowBorrowerQueryParams): Promise<BorrowBorrowerData> {
  const blockHeight = await lastSyncedHeight();

  variables.marketBorrowerInfoQuery.borrower_info.block_height =
    blockHeight + 1;

  const rawData = await mantleFetch<
    BorrowBorrowerRawVariables,
    BorrowBorrowerRawData
  >(
    BORROW_BORROWER_QUERY,
    {
      marketContract: variables.marketContract,
      marketBorrowerInfoQuery: JSON.stringify(
        variables.marketBorrowerInfoQuery,
      ),
      custodyContract: variables.custodyContract,
      custodyBorrowerQuery: JSON.stringify(variables.custodyBorrowerQuery),
    },
    `${mantleEndpoint}?borrow--borrower`,
  );

  return {
    marketBorrowerInfo: JSON.parse(rawData.marketBorrowerInfo.Result),
    custodyBorrower: JSON.parse(rawData.custodyBorrower.Result),
    blockHeight: blockHeight + 1,
  };
}
