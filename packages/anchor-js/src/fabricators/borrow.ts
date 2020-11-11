import { MsgExecuteContract } from "@terra-money/terra.js";
import { validateAddress } from "../utils/validation/address";
import { validateInput } from "../utils/validate-input";
import { validateIsNumber } from "../utils/validation/number";
import { validateWhitelistedMarket } from "../utils/validation/market";
import { validateIsGreaterThanZero } from "../utils/validation/number";

/**
 * 
 * @param address Client’s Terra address.
 * @param market Type of stablecoin money market to borrow.
 * @param loan_id ID of address’s loan position to add borrows.
 * @param amount Amount of stablecoin to borrow.
 * @param withdraw_to (optional) Terra address to withdraw borrowed stablecoin. If null, withdraws to address
 */
export function fabricateBorrow(opts: {
    address: string,
    market: string,
    amount: number,
    withdrawTo?: string,
}): MsgExecuteContract {
  validateInput([
    validateWhitelistedMarket(opts.market),
    validateAddress(opts.address),
    validateIsNumber(opts.amount),
    validateIsGreaterThanZero(opts.amount),
  ])

  return new MsgExecuteContract(
    opts.address,
    "",
    {},
    null,
  )
}