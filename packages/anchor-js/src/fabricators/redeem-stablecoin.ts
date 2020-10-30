import { MsgExecuteContract } from "@terra-money/terra.js";
import { validateAddress } from "../utils/validate-bech32";
import { validateInput } from "../utils/validate-input";

export function fabricateRedeemStablecoin(
    address: string,
    symbol: string,
    amount: number,
): MsgExecuteContract {
    validateInput([
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
        {}, // TODO: implement me
        null,
    )
    
}