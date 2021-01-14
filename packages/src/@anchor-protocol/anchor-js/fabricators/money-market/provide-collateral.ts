import { Dec, Int, MsgExecuteContract } from '@terra-money/terra.js';
import { createHookMsg } from '../../utils/cw20/create-hook-msg';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';
import { validateWhitelistedBAsset } from '../../utils/validation/basset';

import { validateWhitelistedMarket } from '../../utils/validation/market';
import { validateIsGreaterThanZero } from '../../utils/validation/number';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  market: string;
  symbol: string;
  amount: string;
}

/**
 *
 * @param address Client’s Terra address.
 * @param market Type of stablecoin money market to deposit collateral. Currently only supports UST and KRT.
 //  * @param borrower (optional) — Terra address of the entity that created the loan position. If null, adds collateral to address‘s loan position.
 * @param loan_id ID of address’s loan position to add collateral. For each addresses, their first loan position is given ID = 0, second loan ID = 1, third ID = 2, etc.. If this field is [(address’s current highest loan_id) + 1], a new loan position is created.
 * @param symbol Symbol of collateral to deposit.
 * @param amount Amount of collateral to deposit.
 */
export const fabricateProvideCollateral = ({
  address,
  market,
  symbol,
  amount,
}: Option) => (addressProvider: AddressProvider): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    validateWhitelistedMarket(market),
    // borrower ? validateAddress(borrower) : validateTrue,
    validateWhitelistedBAsset(symbol),
    validateIsGreaterThanZero(amount),
  ]);

  const bAssetTokenContract = addressProvider.bAssetToken(symbol.toLowerCase());
  const mmOverseerContract = addressProvider.overseer(market.toLowerCase());
  const custodyContract = addressProvider.custody(market.toLocaleLowerCase());

  // cw20 send + provide_collateral hook
  return [
    // provide_collateral call
    new MsgExecuteContract(address, bAssetTokenContract, {
      send: {
        contract: custodyContract,
        amount: new Int(new Dec(amount).mul(1000000)).toString(),
        msg: createHookMsg({
          deposit_collateral: {},
        }),
      },
    }),
    // lock_collateral call
    new MsgExecuteContract(address, mmOverseerContract, {
      // @see https://github.com/Anchor-Protocol/money-market-contracts/blob/master/contracts/overseer/src/msg.rs#L75
      lock_collateral: {
        collaterals: [
          [
            bAssetTokenContract,
            new Int(new Dec(amount).mul(1000000)).toString(),
          ],
        ],
      },
    }),
  ];
};
