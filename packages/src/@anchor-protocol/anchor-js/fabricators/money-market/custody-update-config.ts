import { MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';
import { validateTrue } from '../../utils/validation/true';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  liquidation_contract?: string;
  custody: string;
}

export const fabricatebCustodyConfig = ({
  address,
  liquidation_contract,
  custody,
}: Option) => (
  addressProvider: AddressProvider,
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    liquidation_contract ? validateAddress(liquidation_contract) : validateTrue,
  ]);

  const mmCustody = addressProvider.custody(custody);

  return [
    new MsgExecuteContract(address, mmCustody, {
      update_config: {
        liquidation_contract: liquidation_contract,
      },
    }),
  ];
};
