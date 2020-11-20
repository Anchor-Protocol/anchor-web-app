import { MsgExecuteContract } from "@terra-money/terra.js"
import { AddressProvider } from "../address-provider/types"
import { validateInput } from "../utils/validate-input"
import { validateAddress, validateValAddress } from "../utils/validation/address"
import { validateIsGreaterThanZero } from "../utils/validation/number"

interface Option {
  address: string
  amount: string
  bAsset: string
  recipient?: string
  validator: string // validator address
}

export const fabricatebAssetClaim = (
  { address, amount, bAsset, recipient, validator }: Option
) => (
  addressProvider: AddressProvider.Provider
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    validateValAddress(validator),
    validateIsGreaterThanZero(amount)
  ])

  const bAssetRewardAddress = addressProvider.bAssetReward(bAsset)

  return [
    new MsgExecuteContract(
      address,
      bAssetRewardAddress,
      {
        claim_reward: {
          recipient: recipient, // always
        }
      }
    )
  ]
}