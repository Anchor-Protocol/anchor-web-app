import { InputEntry } from "../validate-input";
import bassetConstants from "../../constants/basset.json"

export const validateWhitelistedBAsset = (symbol: string): InputEntry => (
    [
        () => bassetConstants.hasOwnProperty(symbol.toLowerCase()),
        `unknown bAsset symbol ${symbol}.`
    ]
)