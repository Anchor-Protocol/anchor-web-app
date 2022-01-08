import { ANC } from '@anchor-protocol/types';
import { JSDateTime, u, UST } from '@libs/types';
import { dedupeTimestamp } from './utils/dedupeTimestamp';

export interface MarketAncHistory {
  anc_price: UST;
  anc_circulating_supply: u<ANC>;
  timestamp: JSDateTime;
  height: number;
  pool_anc_amount: u<ANC>;
  pool_ust_amount: u<UST>;
  govern_total_share: '20083749357366';
  investor_team_anc_holding: '300000000000000';
  shuttle_anc_holding: '4131371012544';
  airdrop_anc_holding: '99080578291262';
  gov_share_index: '175970058944';
  govern_total_deposit: '0';
  staking_contract_lp_balance: '53778063712753';
  govern_anc_holding: '20259719416310';
  distributor_anc_holding: '394116591121952';
  community_anc_holding: '99978000000000';
  lp_total_supply: '53834637172380';
}

export interface MarketAncData {
  now: MarketAncHistory;
  history: MarketAncHistory[];
}

export interface MarketAncQueryParams {
  endpoint: string;
}

export async function marketAncQuery({
  endpoint,
}: MarketAncQueryParams): Promise<MarketAncData> {
  const now: MarketAncHistory = await fetch(`${endpoint}/v1/anc`)
    .then((res) => res.json())
    .then((data: MarketAncHistory) => ({
      ...data,
      timestamp: Date.now() as JSDateTime,
    }));

  const history: MarketAncHistory[] = await fetch(`${endpoint}/v1/anc/1d`)
    .then((res) => res.json())
    .then((data: MarketAncHistory[]) => [...data.reverse(), now]);

  return {
    now,
    history: dedupeTimestamp(history, 'timestamp'),
  };
}
