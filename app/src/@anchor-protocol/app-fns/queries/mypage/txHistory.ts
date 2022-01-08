import { JSDateTime } from '@anchor-protocol/types';

export interface MypageTxHistory {
  tx_type: string;
  /** html string */
  descriptions: string[];
  address: string;
  tx_hash: string;
  timestamp: JSDateTime;
}

export interface MypageTxHistoryData {
  next: string | null;
  history: MypageTxHistory[];
}

export interface MypageTxHistoryQueryParams {
  endpoint: string;
  walletAddress: string;
  offset: string | null;
}

export async function mypageTxHistoryQuery({
  endpoint,
  walletAddress,
  offset,
}: MypageTxHistoryQueryParams): Promise<MypageTxHistoryData> {
  const offsetQuery = offset ? '?offset=' + offset : '';
  const data: MypageTxHistoryData = await fetch(
    `${endpoint}/v1/history/${walletAddress}${offsetQuery}`,
  ).then((res) => res.json());

  return data;
}
