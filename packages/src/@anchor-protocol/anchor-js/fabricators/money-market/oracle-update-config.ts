import { MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';
import { validateTrue } from '../../utils/validation/true';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  owner?: string;
}

export const fabricatebOracleConfig = ({ address, owner }: Option) => (
  addressProvider: AddressProvider,
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    owner ? validateAddress(owner) : validateTrue,
  ]);

  const mmOracle = addressProvider.oracle();

  return [
    new MsgExecuteContract(address, mmOracle, {
      update_config: {
        owner: owner,
      },
    }),
  ];
};
