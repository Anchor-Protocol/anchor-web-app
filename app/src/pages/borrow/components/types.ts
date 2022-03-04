import { BorrowBorrower } from '@anchor-protocol/app-fns';
import { BorrowMarketWithDisplay } from '@anchor-protocol/app-provider';
import { CW20Addr, ERC20Addr } from '@libs/types';
import { UIElementProps } from '@libs/ui';

export interface ProvideCollateralFormParams extends UIElementProps {
  collateralToken: CW20Addr;
  token: CW20Addr | ERC20Addr;
  fallbackBorrowMarket: BorrowMarketWithDisplay;
  fallbackBorrowBorrower: BorrowBorrower;
}

export interface BorrowFormParams extends UIElementProps {
  fallbackBorrowMarket: BorrowMarketWithDisplay;
  fallbackBorrowBorrower: BorrowBorrower;
}
