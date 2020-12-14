import { MsgExecuteContract } from "@terra-money/terra.js"
import { validateInput } from "../utils/validate-input"
import { validateAddress } from "../utils/validation/address"

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