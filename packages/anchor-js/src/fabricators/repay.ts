import { MsgExecuteContract } from "@terra-money/terra.js";
import { validateAddress } from "../utils/validation/address";
import { validateInput } from "../utils/validate-input";
import { validateIsGreaterThanZero } from "../utils/validation/number";
import { validateWhitelistedMarket } from "../utils/validation/market";

/**
 * @param address Client’s Terra address.
 * @param market Type of stablecoin money market to repay.
 * @param borrower (optional) Terra address of the entity that created the loan position.If null, repays address‘s loan
 * @param repay_all boolean value whether to repay all outstanding borrows(true).
 * @param amount (optional) Amount of stablecoin to repay.Set to null if repay_all is set to true.
 */

export function fabricateRepay(opts: {
    address: string,
    market: string,
    borrower?: string,
    repay_all: boolean,
    amount?: number,
}): MsgExecuteContract {
    validateInput([
        validateAddress(opts.address),
        validateWhitelistedMarket(opts.market),
        validateAddress(opts.borrower),
        validateIsGreaterThanZero(opts.amount),
    ])

    return new MsgExecuteContract(
        opts.address,
        "",
        {}, // TODO: implement me
        null,
    )

}