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
  to?: string;
  beliefPrice?: string;
  maxSpread?: string;
}

export const fabricatebSwapbLuna = ({
  address,
  amount,
  bAsset,
  to,
  beliefPrice,
  maxSpread,
}: Option) => (addressProvider: AddressProvider): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    validateIsNumber(amount),
    validateIsGreaterThanZero(+amount),
  ]);

  const bAssetTokenAddress = addressProvider.bAssetToken(bAsset);
  const pairAddress = addressProvider.blunaBurnPair();

  return [
    new MsgExecuteContract(address, bAssetTokenAddress, {
      send: {
        contract: pairAddress,
        amount: new Int(new Dec(amount).mul(1000000)).toString(),
        msg: createHookMsg({
          swap: {
            belief_price: beliefPrice,
            max_spread: maxSpread,
            to: to,
          },
        }),
      },
    }),
  ];
};
