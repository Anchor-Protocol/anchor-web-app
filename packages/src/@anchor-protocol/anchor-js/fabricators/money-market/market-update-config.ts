import { Dec, MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';
import { validateTrue } from '../../utils/validation/true';

interface Option {
  address: string;
  market: string;
  owner_addr?: string;
  interest_model?: string;
  reserve_factor?: Dec;
}

export const fabricatebMarketConfig = ({
  address,
  owner_addr,
  interest_model,
  reserve_factor,
  market,
}: Option) => (
  addressProvider: AddressProvider.Provider,
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    owner_addr ? validateAddress(owner_addr) : validateTrue,
    interest_model ? validateAddress(interest_model) : validateTrue,
  ]);

  const mmMarket = addressProvider.market(market);

  return [
    new MsgExecuteContract(address, mmMarket, {
      update_config: {
        owner_addr: owner_addr,
        interest_model: interest_model,
        reserve_factor: reserve_factor,
      },
    }),
  ];
};
