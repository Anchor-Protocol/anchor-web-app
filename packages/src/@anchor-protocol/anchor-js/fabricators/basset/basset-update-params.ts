import { MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';
import { validateIsNumber } from '../../utils/validation/number';
import { validateTrue } from '../../utils/validation/true';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  bAsset: string;
  epoch_period?: number;
  underlying_coin_denom?: string;
  unbonding_period?: number;
  peg_recovery_fee?: number;
  er_threshold?: number;
  reward_denom?: number;
}

export const fabricatebAssetParams = ({
  address,
  epoch_period,
  underlying_coin_denom,
  unbonding_period,
  peg_recovery_fee,
  er_threshold,
  reward_denom,
  bAsset,
}: Option) => (
  addressProvider: AddressProvider,
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    epoch_period ? validateIsNumber(epoch_period) : validateTrue,
    unbonding_period ? validateIsNumber(unbonding_period) : validateTrue,
    //TODO: validate decimal and denom
  ]);

  // const nativeTokenDenom = bAssetToNative.bluna[bAsset.toLowerCase()]
  const bAssetContractAddress = addressProvider.bAssetHub(bAsset);

  return [
    new MsgExecuteContract(address, bAssetContractAddress, {
      update_params: {
        epoch_period: epoch_period,
        underlying_coin_denom: underlying_coin_denom,
        unbonding_period: unbonding_period,
        peg_recovery_fee: peg_recovery_fee,
        er_threshold: er_threshold,
        reward_denom: reward_denom,
      },
    }),
  ];
};
