import { Dec, MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';

interface Option {
  address: string;
  overseer: string;
  collateral_token: string;
  custody_contract: string;
  ltv?: Dec;
}

export const fabricatebOverseerWhiteList = ({
  address,
  overseer,
  collateral_token,
  custody_contract,
  ltv,
}: Option) => (
  addressProvider: AddressProvider.Provider,
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    validateAddress(collateral_token),
    validateAddress(custody_contract),
  ]);

  const mmOverseer = addressProvider.overseer(overseer);

  return [
    new MsgExecuteContract(address, mmOverseer, {
      update_white_list: {
        collateral_token: collateral_token,
        custody_contract: custody_contract,
        ltv: ltv,
      },
    }),
  ];
};
