import { Int, MsgExecuteContract } from '@terra-money/terra.js';
import { validateAddress } from '../utils/validation/address';
import { validateInput } from '../utils/validate-input';

import { validateIsGreaterThanZero } from '../utils/validation/number';
import { validateWhitelistedBAsset } from '../utils/validation/basset';
import { validateWhitelistedStable } from '../utils/validation/stable';

interface Option {
  address: string;
  symbol: string;
  amount: number;
}

/**
 *
 * @param address Client’s Terra address.
 * @param symbol Symbol of a stablecoin to deposit.
 * @param amount Amount of a stablecoin to deposit.
 */
export const fabricateDepositStableCoin = ({
  address,
  symbol,
  amount,
}: Option) => (
  addressProvider: AddressProvider.Provider,
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    validateWhitelistedStable(symbol),
    validateIsGreaterThanZero(amount),
  ]);

  const nativeTokenDenom = symbol;
  const mmContractAddress = addressProvider.market(symbol);

  return [
    new MsgExecuteContract(
      address,
      mmContractAddress,
      {
        deposit_stable: {
          deposit_amount: new Int(amount * 1000000).toString(),
        },
      },

      // coins
      {
        [`u${nativeTokenDenom}`]: new Int(amount * 1000000).toString(),
      },
    ),
  ];
};
