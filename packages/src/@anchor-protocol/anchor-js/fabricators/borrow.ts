import { MsgExecuteContract } from '@terra-money/terra.js';
import { validateAddress } from '../utils/validation/address';
import { validateInput } from '../utils/validate-input';
import { validateIsNumber } from '../utils/validation/number';
import { validateWhitelistedMarket } from '../utils/validation/market';
import { validateIsGreaterThanZero } from '../utils/validation/number';

interface Option {
  address: string;
  market: string;
  amount: number;
  withdrawTo?: string;
}

/**
 *
 * @param address Client’s Terra address.
 * @param market Type of stablecoin money market to borrow.
 * @param loan_id ID of address’s loan position to add borrows.
 * @param amount Amount of stablecoin to borrow.
 * @param withdraw_to (optional) Terra address to withdraw borrowed stablecoin. If null, withdraws to address
 */
export const fabricateBorrow = ({
  address,
  market,
  amount,
  withdrawTo,
}: Option) => (
  addressProvider: AddressProvider.Provider,
): MsgExecuteContract[] => {
  validateInput([
    validateWhitelistedMarket(market),
    validateAddress(address),
    validateIsNumber(amount),
    validateIsGreaterThanZero(amount),
  ]);

  const mmContractAddress = addressProvider.market(market);

  return [
    new MsgExecuteContract(address, mmContractAddress, {
      borrow_stable: {
        borrow_amount: amount,
        to: withdrawTo || undefined,
      },
    }),
  ];
};
