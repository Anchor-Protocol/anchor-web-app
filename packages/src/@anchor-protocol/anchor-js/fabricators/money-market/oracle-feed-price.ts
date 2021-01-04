import { Dec, MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';

type Price = [string, Dec];

interface Option {
  address: string;
  prices: [Price];
}

export const fabricatebOracleFeedPrice = ({ address, prices }: Option) => (
  addressProvider: AddressProvider.Provider,
): MsgExecuteContract[] => {
  validateInput([validateAddress(address)]);

  const mmOracle = addressProvider.oracle();

  return [
    new MsgExecuteContract(address, mmOracle, {
      feed_price: {
        prices: prices,
      },
    }),
  ];
};
