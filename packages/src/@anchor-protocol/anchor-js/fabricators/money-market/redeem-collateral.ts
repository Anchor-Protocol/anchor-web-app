import { Dec, Int, MsgExecuteContract } from '@terra-money/terra.js';
import { validateAddress } from '../../utils/validation/address';
import { validateInput } from '../../utils/validate-input';

import { validateWhitelistedMarket } from '../../utils/validation/market';
import { validateTrue } from '../../utils/validation/true';
import { validateIsGreaterThanZero } from '../../utils/validation/number';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  market: string;
  borrower?: string;
  amount?: string;
}

/**
 *
 * @param address Client’s Terra address.
 * @param market Type of stablecoin money market to redeem collateral.
 * @param symbol Symbol of collateral to redeem.
 * @param amount (optional) Amount of collateral to redeem. Set this to null if redeem_all is true.
 * @param withdraw_to (optional) Terra address to withdraw redeemed collateral. If null, withdraws to address.
 */
export const fabricateRedeemCollateral = ({
  address,
  market,
  amount,
}: Option) => (addressProvider: AddressProvider): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    validateWhitelistedMarket(market),
    amount ? validateIsGreaterThanZero(amount) : validateTrue,
  ]);

  const mmOverseerContract = addressProvider.overseer(market.toLowerCase());
  const bAssetTokenContract = addressProvider.bAssetToken('ubluna'); // fixed to ubluna for now
  const custodyContract = addressProvider.custody(market.toLocaleLowerCase());

  return [
    // unlock collateral
    new MsgExecuteContract(address, mmOverseerContract, {
      // @see https://github.com/Anchor-Protocol/money-market-contracts/blob/master/contracts/overseer/src/msg.rs#L78
      unlock_collateral: [
        [
          bAssetTokenContract,
          isAmountSet(amount)
            ? new Int(new Dec(amount).mul(1000000)).toString()
            : undefined,
        ],
      ],
    }),

    // withdraw from custody
    new MsgExecuteContract(address, custodyContract, {
      // @see https://github.com/Anchor-Protocol/money-market-contracts/blob/master/contracts/custody/src/msg.rs#L69
      withdraw_collateral: {
        amount: isAmountSet(amount)
          ? new Int(new Dec(amount).mul(1000000)).toString()
          : undefined,
      },
    }),
  ];
};

function isAmountSet(amount: string | undefined): amount is string {
  return !!amount && !new Int(amount).isNaN();
}
