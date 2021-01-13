import { Dec, Int, MsgExecuteContract } from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';

import { validateIsGreaterThanZero } from '../../utils/validation/number';
import { validateWhitelistedStable } from '../../utils/validation/stable';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  symbol: string;
  amount: string;
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
}: Option) => (addressProvider: AddressProvider): MsgExecuteContract[] => {
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
        // @see https://github.com/Anchor-Protocol/money-market-contracts/blob/master/contracts/market/src/msg.rs#L65
        deposit_stable: {},
      },

      // coins
      {
        [`u${nativeTokenDenom}`]: new Int(
          new Dec(amount).mul(1000000),
        ).toString(),
      },
    ),
  ];
};
