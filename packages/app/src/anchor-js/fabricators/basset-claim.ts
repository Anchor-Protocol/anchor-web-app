import { MsgExecuteContract } from "@terra-money/terra.js"
import { validateInput } from "../utils/validate-input"
import { validateAddress, validateValAddress } from "../utils/validation/address"
import { validateIsGreaterThanZero } from "../utils/validation/number"

interface Option {
  address: string
  bAsset: string
  recipient?: string
}

export const fabricatebAssetClaim = (
  { address, bAsset, recipient }: Option
) => (
  addressProvider: AddressProvider.Provider
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    // validateValAddress(validator),
    // validateIsGreaterThanZero(amount)
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