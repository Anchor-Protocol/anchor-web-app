import { MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  overseer: string;
}

export const fabricatebOverseerEpoch = ({ address, overseer }: Option) => (
  addressProvider: AddressProvider,
): MsgExecuteContract[] => {
  validateInput([validateAddress(address)]);

  const mmOverseer = addressProvider.overseer(overseer);

  return [
    new MsgExecuteContract(address, mmOverseer, {
      execute_epoch_operations: {},
    }),
  ];
};
