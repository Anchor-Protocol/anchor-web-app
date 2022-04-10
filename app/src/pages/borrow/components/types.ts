import { BorrowBorrower } from '@anchor-protocol/app-fns';
import { BorrowMarketWithDisplay } from '@anchor-protocol/app-provider';
import { UIElementProps } from '@libs/ui';
import { WhitelistCollateral } from 'queries';

export interface ProvideCollateralFormParams extends UIElementProps {
  collateral: WhitelistCollateral;
  fallbackBorrowMarket: BorrowMarketWithDisplay;
  fallbackBorrowBorrower: BorrowBorrower;
}

export interface RedeemCollateralFormParams extends UIElementProps {
  collateral: WhitelistCollateral;
  fallbackBorrowMarket: BorrowMarketWithDisplay;
  fallbackBorrowBorrower: BorrowBorrower;
}

export interface BorrowFormParams extends UIElementProps {
  fallbackBorrowMarket: BorrowMarketWithDisplay;
  fallbackBorrowBorrower: BorrowBorrower;
}

export interface RepayFormParams extends UIElementProps {
  fallbackBorrowMarket: BorrowMarketWithDisplay;
  fallbackBorrowBorrower: BorrowBorrower;
}
