import { Int, MsgExecuteContract } from "@terra-money/terra.js"
import { validateAddress } from "../utils/validation/address"
import { validateInput } from "../utils/validate-input"
import { validateIsGreaterThanZero } from "../utils/validation/number"
import { AddressProvider } from "../address-provider/types"

interface Option {
  address: string
  symbol: string
  amount: number
}

/**
 * @param address Client’s Terra address.
 * @param symbol Symbol of stablecoin to redeem, or its aToken equivalent.
 * @param amount Amount of a stablecoin to redeem, or amount of an aToken (aTerra) to redeem (specified by symbol).
 */
export function fabricateRedeemStable(
  { address, symbol, amount }: Option,
  addressProvider: AddressProvider.Provider,
): MsgExecuteContract {
  validateInput([
    validateAddress(address),
    validateIsGreaterThanZero(amount),
  ])

  const marketAddress = addressProvider.market(symbol)
  const aTokenAddress  = addressProvider.aToken(symbol)

  return new MsgExecuteContract(
    address,
    aTokenAddress,
    {
      send: {
        address: marketAddress,
        amount: new Int(amount).toString(),
        msg: createHookMsg({
          redeem_stable: {}
        })
      }
    }, // TODO: implement me
    null,
  )
}