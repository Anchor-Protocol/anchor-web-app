import { EvmCrossAnchorSdk } from '@anchor-protocol/crossanchor-sdk/lib/esm/crossanchor/evm/sdk';
import {
  CollateralAmount,
  ERC20Addr,
  HumanAddr,
  u,
} from '@anchor-protocol/types';
import Big from 'big.js';
import { WhitelistCollateral } from 'queries';

declare module '@anchor-protocol/crossanchor-sdk/lib/esm/crossanchor/evm/sdk' {
  export interface EvmCrossAnchorSdk {
    fetchWalletBalance(
      walletAddr: HumanAddr,
      collateral: WhitelistCollateral,
    ): Promise<u<CollateralAmount<Big>>>;
    fetchERC20Token(address: ERC20Addr): Promise<ERC20Token>;
  }
}

EvmCrossAnchorSdk.prototype.fetchWalletBalance = async function (
  walletAddr: HumanAddr,
  collateral: WhitelistCollateral,
): Promise<u<CollateralAmount<Big>>> {
  if (collateral === undefined || collateral.bridgedAddress === undefined) {
    return Big(0) as u<CollateralAmount<Big>>;
  }

  const balance = await this.balance(collateral.bridgedAddress, walletAddr);

  const decimals = await this.decimals(collateral.bridgedAddress);

  const amount = Big(balance).div(Math.pow(10, decimals));

  return amount.mul(Math.pow(10, collateral.decimals)) as u<
    CollateralAmount<Big>
  >;
};

export interface ERC20Token {
  address: ERC20Addr;
  symbol: string;
  decimals: number;
}

EvmCrossAnchorSdk.prototype.fetchERC20Token = async function (
  address: ERC20Addr,
): Promise<ERC20Token> {
  const decimals = await this.decimals(address);

  const symbol = await this.symbol(address);

  return { address, decimals, symbol };
};
