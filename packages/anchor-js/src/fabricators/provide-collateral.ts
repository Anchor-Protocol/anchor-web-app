import { MsgExecuteContract } from "@terra-money/terra.js";
import { validateAddress } from "../utils/validate-bech32";
import { validateInput } from "../utils/validate-input";

import marketConstant from "../constants/market.json"

/**
 * 
 * @param address Client’s Terra address.
 * @param market Type of stablecoin money market to deposit collateral. Currently only supports UST and KRT.
 * @param borrower (optional) — Terra address of the entity that created the loan position. If null, adds collateral to address‘s loan position.
 * @param loan_id ID of address’s loan position to add collateral. For each addresses, their first loan position is given ID = 0, second loan ID = 1, third ID = 2, etc.. If this field is [(address’s current highest loan_id) + 1], a new loan position is created.
 * @param symbol Symbol of collateral to deposit.
 * @param amount Amount of collateral to deposit.
 */
export function fabricateProvideCollateral(
    address: string, 
    market: string,
    borrower: string | null,
    loan_id: string,
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
        [
            () => !!parseInt(loan_id, 10), // won't be triggered, rather thrown from this
            `invalid loan_id: ${loan_id}`,
        ],
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