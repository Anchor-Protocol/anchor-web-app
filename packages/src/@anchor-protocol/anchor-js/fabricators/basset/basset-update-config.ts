import { MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';
import { validateTrue } from '../../utils/validation/true';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  bAsset: string;
  owner?: string;
  reward_contract?: string;
  token_contract?: string;
}

export const fabricatebAssetConfig = ({
  address,
  owner,
  reward_contract,
  token_contract,
  bAsset,
}: Option) => (
  addressProvider: AddressProvider,
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    reward_contract ? validateAddress(reward_contract) : validateTrue,
    token_contract ? validateAddress(token_contract) : validateTrue,
  ]);

  // const nativeTokenDenom = bAssetToNative.bluna[bAsset.toLowerCase()]
  const bAssetContractAddress = addressProvider.bAssetHub(bAsset);

  return [
    new MsgExecuteContract(address, bAssetContractAddress, {
      update_config: {
        owner: owner,
        reward_contract: reward_contract,
        token_contract: token_contract,
      },
    }),
  ];
};
