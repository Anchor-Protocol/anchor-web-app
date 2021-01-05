import { Dec, Int, MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';
import {
  validateIsGreaterThanZero,
  validateIsNumber,
} from '../../utils/validation/number';
import { createHookMsg } from '../../utils/cw20/create-hook-msg';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  amount: string;
  bAsset: string;
}

export const fabricatebAssetBurn = ({ address, amount, bAsset }: Option) => (
  addressProvider: AddressProvider,
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    validateIsNumber(+amount),
    validateIsGreaterThanZero(+amount),
  ]);

  const bAssetTokenAddress = addressProvider.bAssetToken(bAsset);
  const bAssetHubAddress = addressProvider.bAssetHub(bAsset);

  return [
    new MsgExecuteContract(address, bAssetTokenAddress, {
      // @see https://github.com/Anchor-Protocol/anchor-bAsset-contracts/blob/cce41e707c67ee2852c4929e17fb1472dbd2aa35/contracts/anchor_basset_token/src/handler.rs#L101
      send: {
        contract: bAssetHubAddress,
        amount: new Int(new Dec(amount).mul(1000000)).toString(),
        msg: createHookMsg({
          unbond: {},
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
