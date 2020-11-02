import { MsgExecuteContract } from "@terra-money/terra.js";
import { validateAddress } from "../utils/validate-bech32";
import { validateInput } from "../utils/validate-input";

import marketConstant from "../constants/market.json"

/**
 * 
 * @param address — Client’s Terra address.
 * @param market — Type of stablecoin money market to deposit collateral.
 * @param symbol — Symbol of collateral to redeem.
 * @param redeem_all — Set this to true to redeem all symbol collateral deposited to loan_id.
 * @param amount (optional) — Amount of collateral to redeem. Set this to null if redeem_all is true.
 * @param withdraw_to (optional) — Terra address to withdraw redeemed collateral. If null, withdraws to address.
 */
export function fabricateRedeemCollateral(
    address: string,
    market: string,
    borrower: string | null,
    // loan_id: string,
    symbol: string,
    amount: number
): MsgExecuteContract {
    const denom = marketConstant[market]

    validateInput([
        [
            () => validateAddress(address),
            `invalid address ${address}.`
        ],
        [
            () => typeof denom !== "undefined",
            `unknown market ${market}`,
        ],
        [
            () => borrower ? validateAddress(borrower) : true,
            `invalid address ${borrower}`
        ],
        // [
        //     () => !!parseInt(loan_id, 10), // won't be triggered, rather thrown from this
        //     `invalid loan_id: ${loan_id}`,
        // ],
        [
            () => true, // TODO: check if bAsset symbol is whitelisted,
            `unknown bAsset denom ${symbol}`,
        ]
    ])

    return new MsgExecuteContract(
        address,
        "",
        {},
        null,
    )
}