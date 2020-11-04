import { MsgExecuteContract } from "@terra-money/terra.js";
import { validateAddress } from "../utils/validation/address";
import { validateInput } from "../utils/validate-input";

import { validateWhitelistedMarket } from "../utils/validation/market";
import { validateIsGreaterThanZero } from "../utils/validation/number";
import { validateWhitelistedBAsset } from "../utils/validation/basset";

/**
 * 
 * @param address Client’s Terra address.
 * @param market Type of stablecoin money market to deposit collateral. Currently only supports UST and KRT.
 * @param borrower (optional) — Terra address of the entity that created the loan position. If null, adds collateral to address‘s loan position.
 * @param loan_id ID of address’s loan position to add collateral. For each addresses, their first loan position is given ID = 0, second loan ID = 1, third ID = 2, etc.. If this field is [(address’s current highest loan_id) + 1], a new loan position is created.
 * @param symbol Symbol of collateral to deposit.
 * @param amount Amount of collateral to deposit.
 */
export function fabricateProvideCollateral(opts: {
    address: string,
    market: string,
    borrower?: string,
    symbol: string,
    amount: number
}): MsgExecuteContract {
    validateInput([
        validateAddress(opts.address),
        validateWhitelistedMarket(opts.market),
        validateAddress(opts.borrower),
        validateWhitelistedBAsset(opts.symbol),
        validateIsGreaterThanZero(opts.amount),
    ])

    return new MsgExecuteContract(
        opts.address,
        "",
        {},
        null,
    )
}