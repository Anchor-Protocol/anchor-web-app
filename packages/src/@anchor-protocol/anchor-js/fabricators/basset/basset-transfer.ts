import { Int, MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';
import {
  validateIsGreaterThanZero,
  validateIsNumber,
} from '../../utils/validation/number';

interface Option {
  address: string;
  amount: string;
  bAsset: string;
  recipient: string;
}

export const fabricatebAssetTransfer = ({
  address,
  amount,
  bAsset,
  recipient,
}: Option) => (
  addressProvider: AddressProvider.Provider,
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    validateIsNumber(+amount),
    validateIsGreaterThanZero(+amount),
    validateAddress(recipient),
  ]);

  const bAssetTokenAddress = addressProvider.bAssetToken(bAsset);

  return [
    new MsgExecuteContract(address, bAssetTokenAddress, {
      // @see https://github.com/Anchor-Protocol/anchor-bAsset-contracts/blob/cce41e707c67ee2852c4929e17fb1472dbd2aa35/contracts/anchor_basset_token/src/handler.rs#L17
      transfer: {
        recipient: recipient,
        amount: new Int(amount).mul(1000000).toString(),
      },
    }),
  ];
};
