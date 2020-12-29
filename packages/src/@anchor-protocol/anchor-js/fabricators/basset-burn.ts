import { Int, MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../utils/validate-input';
import { validateAddress } from '../utils/validation/address';
import {
  validateIsGreaterThanZero,
  validateIsNumber,
} from '../utils/validation/number';
import { createHookMsg } from '../utils/cw20/create-hook-msg';

interface Option {
  address: string;
  amount: string;
  bAsset: string;
}

export const fabricatebAssetBurn = ({ address, amount, bAsset }: Option) => (
  addressProvider: AddressProvider.Provider,
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    validateIsNumber(+amount),
    validateIsGreaterThanZero(+amount),
  ]);

  const bAssetTokenAddress = addressProvider.bAssetToken(bAsset);
  const bAssetGovAddress = addressProvider.bAssetGov(bAsset);

  return [
    new MsgExecuteContract(address, bAssetTokenAddress, {
      // @see https://github.com/Anchor-Protocol/anchor-bAsset-contracts/blob/master/contracts/anchor_basset_token/src/handler.rs#L101
      send: {
        contract: bAssetGovAddress,
        amount: new Int(+amount * 1000000).toString(),
        msg: createHookMsg({
          init_burn: {},
        }),
      },
    }),
  ];
};

// new MsgExecuteContract(
//   address,
//   bAssetGovAddress,
//   {
//     finish_burn: {}
//   }
// )
