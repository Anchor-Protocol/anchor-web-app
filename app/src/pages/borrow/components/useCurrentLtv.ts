import { Ratio } from '@anchor-protocol/notation';
import big, { Big } from 'big.js';
import { Data as MarketOverview } from 'pages/borrow/queries/marketOverview';
import { Data as MarketUserOverview } from 'pages/borrow/queries/marketUserOverview';
import { useMemo } from 'react';

interface Params {
  marketOverview: MarketOverview;
  marketUserOverview: MarketUserOverview;
}

export function useCurrentLtv({
  marketOverview,
  marketUserOverview,
}: Params): Ratio<Big> | undefined {
  // loan_amount / ( (borrow_info.balance - borrow_info.spendable) * oracle_price )
  return useMemo(() => {
    try {
      return big(marketUserOverview.loanAmount.loan_amount).div(
        big(
          big(marketUserOverview.borrowInfo.balance).minus(
            marketUserOverview.borrowInfo.spendable,
          ),
        ).mul(marketOverview.oraclePrice.rate),
      ) as Ratio<Big>;
    } catch {
      return undefined;
    }
  }, [
    marketOverview.oraclePrice.rate,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketUserOverview.loanAmount.loan_amount,
  ]);
}
