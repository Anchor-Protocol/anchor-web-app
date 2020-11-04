import { MsgExecuteContract } from "@terra-money/terra.js";
import { validateAddress } from "../utils/validation/address";
import { validateInput } from "../utils/validate-input";
import { validateIsGreaterThanZero } from "../utils/validation/number";

/**
 * @param address Client’s Terra address.
 * @param symbol Symbol of stablecoin to redeem, or its aToken equivalent.
 * @param amount Amount of a stablecoin to redeem, or amount of an aToken (aTerra) to redeem (specified by symbol).
 */
export function fabricateRedeemStablecoin(opts: {
    address: string,
    symbol: string,
    amount: number,
}): MsgExecuteContract {
    validateInput([
        validateAddress(opts.address),
        validateIsGreaterThanZero(opts.amount),
    ])

    return new MsgExecuteContract(
        opts.address,
        "",
        {}, // TODO: implement me
        null,
    )
    
}