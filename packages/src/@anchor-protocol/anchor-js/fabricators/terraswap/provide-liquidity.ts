import { MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  bAsset: string;
  asset: Asset[];
  amount: string;
  quote: string;
  slippageTolerance: string;
}

export interface Token {
  contractAddress: string;
}

export interface NativeToken {
  denom: string;
}

export type AssetInfo = { token: Token } | { native_token: NativeToken };

export interface Asset {
  info: AssetInfo;
  amount?: string;
}

export const fabricateTerraSwapProvideLiquidity = ({
  address,
  slippageTolerance,
  asset,
  quote,
}: Option) => (addressProvider: AddressProvider): MsgExecuteContract[] => {
  validateInput([validateAddress(address)]);

  const pairAddress = addressProvider.blunaBurn(quote);
  return [
    new MsgExecuteContract(address, pairAddress, {
      provide_liquidity: {
        assets: asset,
        slippage_tolerance: slippageTolerance,
      },
    }),
  ];
};
