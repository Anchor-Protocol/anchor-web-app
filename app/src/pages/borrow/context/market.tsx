import {
  Data as MarketBalance,
  useMarketBalanceOverview,
} from 'pages/borrow/queries/marketBalanceOverview';
import {
  Data as MarketOverview,
  useMarketOverview,
} from 'pages/borrow/queries/marketOverview';
import {
  Data as MarketUserOverview,
  useMarketUserOverview,
} from 'pages/borrow/queries/marketUserOverview';
import type { ReactNode } from 'react';
import { Consumer, Context, createContext, useContext, useMemo } from 'react';

export interface MarketProviderProps {
  children: ReactNode;
}

export interface MarketState {
  marketBalance: MarketBalance | undefined;
  marketOverview: MarketOverview | undefined;
  marketUserOverview: MarketUserOverview | undefined;
  refetch: () => void;
}

// @ts-ignore
const MarketContext: Context<MarketState> = createContext<MarketState>();

export function MarketProvider({ children }: MarketProviderProps) {
  const { parsedData: marketBalance, refetch } = useMarketBalanceOverview();
  const { parsedData: marketOverview } = useMarketOverview({ marketBalance });
  const { parsedData: marketUserOverview } = useMarketUserOverview({
    marketBalance,
  });
  
  const state = useMemo<MarketState>(
    () => ({
      marketBalance,
      marketOverview,
      marketUserOverview,
      refetch,
    }),
    [marketBalance, marketOverview, marketUserOverview, refetch],
  );

  return (
    <MarketContext.Provider value={state}>{children}</MarketContext.Provider>
  );
}

export function useMarket(): MarketState {
  return useContext(MarketContext);
}

export function useMarketNotNullable(): {
  marketBalance: MarketBalance;
  marketOverview: MarketOverview;
  marketUserOverview: MarketUserOverview;
  refetch: () => void;
} {
  const {
    marketBalance,
    marketOverview,
    marketUserOverview,
    refetch,
  } = useContext(MarketContext);

  if (!marketBalance || !marketOverview || !marketUserOverview) {
    throw new Error(`Datas can not be undefined`);
  }

  return {
    marketBalance,
    marketOverview,
    marketUserOverview,
    refetch,
  };
}

export const MarketConsumer: Consumer<MarketState> = MarketContext.Consumer;
