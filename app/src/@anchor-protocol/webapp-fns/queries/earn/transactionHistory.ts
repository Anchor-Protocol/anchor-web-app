import { DateTime, Denom, HumanAddr, uUST } from '@anchor-protocol/types';
import { MantleFetch } from '@packages/webapp-fns';

export interface EarnTransactionHistoryData {
  transactionHistory: {
    Address: HumanAddr;
    Contract: string;
    Height: number;
    InAmount: uUST;
    InDenom: Denom;
    OutAmount: uUST;
    OutDenom: Denom;
    Timestamp: DateTime;
    TransactionType: string;
    TxHash: string;
  }[];
}

export interface EarnTransactionHistoryVariables {
  walletAddress: HumanAddr;
}

// language=graphql
export const EARN_TRANSACTION_HISTORY_QUERY = `
  query ($walletAddress: String!) {
    transactionHistory: TransactionHistory(
      Address: $walletAddress
      Order: DESC
    ) {
      Address
      Contract
      InAmount
      InDenom
      OutAmount
      OutDenom
      Timestamp
      TransactionType
      TxHash
      Height
    }
  }
`;

export interface EarnTransactionHistoryQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: EarnTransactionHistoryVariables;
}

export async function earnTransactionHistoryQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: EarnTransactionHistoryQueryParams): Promise<EarnTransactionHistoryData> {
  return await mantleFetch<
    EarnTransactionHistoryVariables,
    EarnTransactionHistoryData
  >(
    EARN_TRANSACTION_HISTORY_QUERY,
    {
      walletAddress: variables.walletAddress,
    } as EarnTransactionHistoryVariables,
    `${mantleEndpoint}?earn--transaction-history&wallet-address=${variables.walletAddress}`,
  );
}
