import { MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  bAsset: string;
  contractAddress: string;
  asset: Asset[];
  amount: string;
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
  contractAddress,
  slippageTolerance,
  asset,
}: Option): MsgExecuteContract[] => {
  validateInput([validateAddress(address)]);

  return [
    new MsgExecuteContract(address, contractAddress, {
      provide_liquidity: {
        assets: asset,
        slippage_tolerance: slippageTolerance, // set to 1% just in case
      },
    }),
  ];
};
