import { InputEntry } from "../validate-input"
import marketConstant from "../../constants/market.json"

export const validateWhitelistedMarket = (market: string): InputEntry => (
  [
    () => !!marketConstant.ust && market === 'ust',
    `unknown market ${market}.`
  ]
)