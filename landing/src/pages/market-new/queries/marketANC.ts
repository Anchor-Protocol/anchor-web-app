import { UST, uUST } from '@anchor-protocol/types';
import { REFRESH_INTERVAL } from 'pages/market-new/env';
import { useQuery, UseQueryResult } from 'react-query';

export interface MarketANCResponse {
  anc_price: UST;
  govern_total_share: '20083749357366';
  anc_circulating_supply: uUST;
  investor_team_anc_holding: '300000000000000';
  shuttle_anc_holding: '4131371012544';
  airdrop_anc_holding: '99080578291262';
  timestamp: 1622099439634;
  gov_share_index: '175970058944';
  govern_total_deposit: '0';
  staking_contract_lp_balance: '53778063712753';
  govern_anc_holding: '20259719416310';
  height: 3125366;
  pool_anc_amount: '34621607922473';
  pool_ust_amount: '95096344006280';
  distributor_anc_holding: '394116591121952';
  community_anc_holding: '99978000000000';
  lp_total_supply: '53834637172380';
}

export function queryMarketANC() {
  return fetch(`https://anchor-services.vercel.app/api/anc`).then((res) =>
    res.json(),
  );
}

export function useMarketANC(): UseQueryResult<MarketANCResponse> {
  return useQuery('marketANC', queryMarketANC, {
    refetchInterval: REFRESH_INTERVAL,
  });
}
