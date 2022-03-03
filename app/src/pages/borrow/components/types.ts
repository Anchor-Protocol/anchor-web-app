import { BorrowBorrower } from '@anchor-protocol/app-fns';
import { BorrowMarketWithDisplay } from '@anchor-protocol/app-provider';
import { CW20Addr } from '@libs/types';
import { UIElementProps } from '@libs/ui';

export interface ProvideCollateralFormParams extends UIElementProps {
  collateralToken: CW20Addr;
  fallbackBorrowMarket: BorrowMarketWithDisplay;
  fallbackBorrowBorrower: BorrowBorrower;
}
