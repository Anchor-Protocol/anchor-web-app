import { MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  market: string;
  overseer_contract: string;
}

export const fabricatebMarketRegOverseer = ({
  address,
  overseer_contract,
  market,
}: Option) => (
  addressProvider: AddressProvider,
): MsgExecuteContract[] => {
  validateInput([validateAddress(address), validateAddress(overseer_contract)]);

  const mmMarket = addressProvider.market(market);

  return [
    new MsgExecuteContract(address, mmMarket, {
      register_overseer: {
        overseer_contract: overseer_contract,
      },
    }),
  ];
};
