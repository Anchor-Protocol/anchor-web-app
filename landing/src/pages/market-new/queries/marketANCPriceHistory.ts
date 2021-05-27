import { JSDateTime, uANC, UST, uUST } from '@anchor-protocol/types';
import { useQuery, UseQueryResult } from 'react-query';
import { REFRESH_INTERVAL } from '../env';

export interface MarketANCPriceHistory {
  airdrop_anc_holding: '99081594759447';
  anc_circulating_supply: uANC;
  anc_price: UST;
  community_anc_holding: '99978000000000';
  distributor_anc_holding: '394121004798909';
  gov_share_index: '176040932554';
  govern_anc_holding: '20267879211134';
  govern_total_deposit: '0';
  govern_total_share: '20091838278580';
  height: 3124267;
  investor_team_anc_holding: '300000000000000';
  lp_total_supply: '53815843655596';
  pool_anc_amount: uANC;
  pool_ust_amount: uUST;
  shuttle_anc_holding: '4131371012544';
  staking_contract_lp_balance: '53759286003547';
  timestamp: JSDateTime; // 1622092013043;
}

export function queryMarketANCPriceHistory() {
  return fetch(`https://api.anchorprotocol.com/api/anc/1d`)
    .then((res) => res.json())
    .then((data: MarketANCPriceHistory[]) => data.reverse());
}

export function useMarketANCPriceHistory(): UseQueryResult<
  MarketANCPriceHistory[]
> {
  return useQuery('marketANCPriceHistory', queryMarketANCPriceHistory, {
    refetchInterval: REFRESH_INTERVAL,
    keepPreviousData: true,
    placeholderData: () => {
      return [];
    },
  });
}
