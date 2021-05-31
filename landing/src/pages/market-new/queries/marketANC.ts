import { JSDateTime, uANC, UST, uUST } from '@anchor-protocol/types';
import { useQuery, UseQueryResult } from 'react-query';
import { REFRESH_INTERVAL } from '../env';

export interface MarketANCHistory {
  anc_price: UST;
  anc_circulating_supply: uANC;
  timestamp: JSDateTime;
  height: number;
  pool_anc_amount: uANC;
  pool_ust_amount: uUST;
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

export interface MarketANCResponse {
  now: MarketANCHistory;
  history: MarketANCHistory[];
}

export async function queryMarketANC() {
  const now: MarketANCHistory = await fetch(
    `https://anchor-services.vercel.app/api/anc`,
  )
    .then((res) => res.json())
    .then((data: MarketANCHistory) => ({
      ...data,
      timestamp: Date.now() as JSDateTime,
    }));

  const history: MarketANCHistory[] = await fetch(
    `https://api.anchorprotocol.com/api/anc/1d`,
  )
    .then((res) => res.json())
    .then((data: MarketANCHistory[]) => [...data.reverse(), now]);

  return {
    now,
    history,
  };
}

export function useMarketANC(): UseQueryResult<MarketANCResponse> {
  return useQuery('marketANC', queryMarketANC, {
    refetchInterval: REFRESH_INTERVAL,
  });
}
