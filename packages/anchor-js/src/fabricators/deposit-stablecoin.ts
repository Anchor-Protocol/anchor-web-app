import { MsgExecuteContract } from "@terra-money/terra.js"
import { validateAddress } from "../utils/validate-bech32"
import { validateInput } from "../utils/validate-input"

import marketConstant from "../constants/market.json"

export function fabricateDepositStableCoin(
    address: string,
    market: string,
    amount: number,
): MsgExecuteContract {
    const denom = marketConstant[market]

    validateInput([
        [
            () => denom !== "undefined",
            `unknown market ${market}.`
        ],
        [
            () => validateAddress(address),
            `invalid address ${address}.`
        ],
        [
            () => amount > 0,
            `amount must be > 0.`
        ]
    ])

    return new MsgExecuteContract(
        address,
        "",
        {},  // TODO: implement me
        {
            [denom]: (amount * 1000000).toString()
        }
    )
}