import { Dec, MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';
import { validateTrue } from '../../utils/validation/true';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  owner?: string;
  base_rate?: Dec;
  interest_multiplier?: Dec;
}

export const fabricatebInterestConfig = ({
  address,
  owner,
  base_rate,
  interest_multiplier,
}: Option) => (
  addressProvider: AddressProvider,
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    owner ? validateAddress(owner) : validateTrue,
  ]);

  const mmInterest = addressProvider.interest();

  return [
    new MsgExecuteContract(address, mmInterest, {
      update_config: {
        owner: owner,
        base_rate: base_rate,
        interest_multiplier: interest_multiplier,
      },
    }),
  ];
};
