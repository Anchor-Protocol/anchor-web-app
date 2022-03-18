import { BorrowBorrower } from '@anchor-protocol/app-fns';
import { BorrowMarketWithDisplay } from '@anchor-protocol/app-provider';
import { CW20TokenDisplayInfo } from '@libs/app-fns';
import { CW20Addr, ERC20Addr } from '@libs/types';
import { UIElementProps } from '@libs/ui';

export interface ProvideCollateralFormParams extends UIElementProps {
  collateralToken: CW20Addr;
  token: CW20Addr | ERC20Addr;
  fallbackBorrowMarket: BorrowMarketWithDisplay;
  fallbackBorrowBorrower: BorrowBorrower;
  tokenDisplay?: CW20TokenDisplayInfo;
}

export interface RedeemCollateralFormParams extends UIElementProps {
  collateralToken: CW20Addr;
  token: CW20Addr | ERC20Addr;
  fallbackBorrowMarket: BorrowMarketWithDisplay;
  fallbackBorrowBorrower: BorrowBorrower;
  tokenDisplay?: CW20TokenDisplayInfo;
}

export interface BorrowFormParams extends UIElementProps {
  fallbackBorrowMarket: BorrowMarketWithDisplay;
  fallbackBorrowBorrower: BorrowBorrower;
}

export interface RepayFormParams extends UIElementProps {
  fallbackBorrowMarket: BorrowMarketWithDisplay;
  fallbackBorrowBorrower: BorrowBorrower;
}
