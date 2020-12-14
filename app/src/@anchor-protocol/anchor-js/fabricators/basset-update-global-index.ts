import { MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../utils/validate-input';
import { validateAddress } from '../utils/validation/address';

interface Option {
  address: string;
  bAsset: string;
}

export const fabricatebAssetUpdateGlobalIndex = ({
  address,
  bAsset,
}: Option) => (
  addressProvider: AddressProvider.Provider,
): MsgExecuteContract[] => {
  validateInput([validateAddress(address)]);

  const bAssetRewardAddress = addressProvider.bAssetReward(bAsset);

  return [
    new MsgExecuteContract(address, bAssetRewardAddress, {
      update_global_index: {},
    }),
  ];
};
