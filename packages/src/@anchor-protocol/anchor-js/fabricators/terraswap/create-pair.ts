import { MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  bAsset: string;
  contractAddress: string;
  nativeToken: string;
}

export const fabricatebTerraSwapCreatePair = ({
  address,
  bAsset,
  contractAddress,
  nativeToken,
}: Option) => (addressProvider: AddressProvider): MsgExecuteContract[] => {
  validateInput([validateAddress(address)]);

  const bAssetTokenAddress = addressProvider.bAssetToken(bAsset);
  return [
    new MsgExecuteContract(address, contractAddress, {
      create_pair: {
        asset_infos: [
          {
            token: {
              contract_addr: bAssetTokenAddress,
            },
          },
          {
            native_token: {
              denom: nativeToken,
            },
          },
        ],
      },
    }),
  ];
};
