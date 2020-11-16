import { Int, MsgExecuteContract } from "@terra-money/terra.js"
import { AddressProvider } from "../address-provider/types"
import { validateInput } from "../utils/validate-input"
import { validateAddress } from "../utils/validation/address"
import { validateIsGreaterThanZero } from "../utils/validation/number"
import { createHookMsg } from "../utils/cw20/create-hook-msg"

interface Option {
  address: string
  amount: string
  bAsset: string
  validator: string // validator address
}

export function bAssetBurn(
  { address, amount, bAsset }: Option,
  addressProvider: AddressProvider.Provider
): MsgExecuteContract[] {
  validateInput([
    validateAddress(address),
    validateIsGreaterThanZero(amount)
  ])

  const bAssetTokenAddress = addressProvider.bAssetToken(bAsset)
  const bAssetGovAddress = addressProvider.bAssetGov(bAsset)

  return [
    new MsgExecuteContract(
      address,
      bAssetTokenAddress,
      {
        send: {
          address: bAssetGovAddress,
          amount: new Int(amount).toString(),
          msg: createHookMsg({
            init_burn: {}
          })
        }
      }
    )
  ]
}

// new MsgExecuteContract(
//   address,
//   bAssetGovAddress,
//   {
//     finish_burn: {}
//   }
// )

