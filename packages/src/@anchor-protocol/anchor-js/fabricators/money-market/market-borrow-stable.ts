import { Dec, Int, MsgExecuteContract } from '@terra-money/terra.js';
import { validateAddress } from '../../utils/validation/address';
import { validateInput } from '../../utils/validate-input';
import { validateIsNumber } from '../../utils/validation/number';
import { validateWhitelistedMarket } from '../../utils/validation/market';
import { validateIsGreaterThanZero } from '../../utils/validation/number';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  market: string;
  amount: string;
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
}: Option) => (addressProvider: AddressProvider): MsgExecuteContract[] => {
  validateInput([
    validateWhitelistedMarket(market),
    validateAddress(address),
    validateIsNumber(amount),
    validateIsGreaterThanZero(amount),
  ]);

  const mmContractAddress = addressProvider.market(market);

  return [
    new MsgExecuteContract(address, mmContractAddress, {
      // @see https://github.com/Anchor-Protocol/money-market-contracts/blob/master/contracts/market/src/msg.rs#L68
      borrow_stable: {
        borrow_amount: new Int(new Dec(amount).mul(1000000)).toString(),
        to: withdrawTo || undefined,
      },
    }),
  ];
};
