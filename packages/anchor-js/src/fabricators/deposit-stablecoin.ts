import { MsgExecuteContract } from "@terra-money/terra.js"
import { validateAddress } from "../utils/validation/address"
import { validateInput } from "../utils/validate-input"

import marketConstant from "../constants/market.json"
import { validateWhitelistedMarket } from "../utils/validation/market"
import { validateIsGreaterThanZero } from "../utils/validation/number"

/**
 * 
 * @param address Client’s Terra address.
 * @param symbol Symbol of a stablecoin to deposit.
 * @param amount Amount of a stablecoin to deposit.
 */
export function fabricateDepositStableCoin(opts: {
    address: string,
    market: string,
    amount: number,
}): MsgExecuteContract {
    validateInput([
        validateAddress(opts.address),
        validateWhitelistedMarket(opts.market),
        validateIsGreaterThanZero(opts.amount),
    ])

    const denom = marketConstant[opts.market]

    return new MsgExecuteContract(
        opts.address,
        "",
        {},  // TODO: implement me
        {
            [denom]: (opts.amount * 1000000).toString()
        }
    )
}