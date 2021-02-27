import { CW20Addr } from '@anchor-protocol/types/contracts/common';
import { uUST } from '@anchor-protocol/types/currencies';

export interface LiquidationAmount {
  liquidation_amount: {
    borrow_amount: uUST;
    borrow_limit: uUST;
    collaterals: [
      [CW20Addr, uUST], // (Cw20 contract address, Locked amount)
      [CW20Addr, uUST],
    ];
    collateral_prices: [
      uUST, // Price of collateral
      uUST,
    ];
  };
}

export interface LiquidationAmountResponse {
  collaterals: Array<[CW20Addr, uUST]>;
}
