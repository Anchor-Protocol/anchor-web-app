import { MsgExecuteContract } from "@terra-money/terra.js";
import { validateAddress } from "../utils/validation/address";
import { validateInput } from "../utils/validate-input";

import { validateWhitelistedMarket } from "../utils/validation/market";
import { validateWhitelistedBAsset } from "../utils/validation/basset";

/**
 * 
 * @param address Client’s Terra address.
 * @param market Type of stablecoin money market to deposit collateral.
 * @param symbol Symbol of collateral to redeem.
 * @param redeem_all Set this to true to redeem all symbol collateral deposited to loan_id.
 * @param amount (optional) Amount of collateral to redeem. Set this to null if redeem_all is true.
 * @param withdraw_to (optional) Terra address to withdraw redeemed collateral. If null, withdraws to address.
 */
export function fabricateRedeemCollateral(opts: {
    address: string,
    market: string,
    borrower?: string,
    symbol: string,
    amount: number
}): MsgExecuteContract {
    validateInput([
        validateAddress(opts.address),
        validateWhitelistedMarket(opts.market),
        opts.borrower ? validateAddress(opts.borrower) : null,
        validateWhitelistedBAsset(opts.symbol),
    ])

    return new MsgExecuteContract(
        opts.address,
        "",
        {},
        null,
    )
}