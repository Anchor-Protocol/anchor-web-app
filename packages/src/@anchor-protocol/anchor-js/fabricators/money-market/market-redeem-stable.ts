import { Dec, Int, MsgExecuteContract } from '@terra-money/terra.js';
import { validateAddress } from '../../utils/validation/address';
import { validateInput } from '../../utils/validate-input';
import { validateIsGreaterThanZero } from '../../utils/validation/number';
import { createHookMsg } from '../../utils/cw20/create-hook-msg';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  symbol: string;
  amount: string;
}

/**
 * @param address Client’s Terra address.
 * @param symbol Symbol of stablecoin to redeem, or its aToken equivalent.
 * @param amount Amount of a stablecoin to redeem, or amount of an aToken (aTerra) to redeem (specified by symbol).
 */
export const fabricateRedeemStable = ({ address, symbol, amount }: Option) => (
  addressProvider: AddressProvider,
): MsgExecuteContract[] => {
  validateInput([validateAddress(address), validateIsGreaterThanZero(amount)]);

  const marketAddress = addressProvider.market(symbol);
  const aTokenAddress = addressProvider.aToken(symbol);

  return [
    new MsgExecuteContract(address, aTokenAddress, {
      send: {
        contract: marketAddress,
        amount: new Int(new Dec(amount).mul(1000000)).toString(),
        msg: createHookMsg({
          redeem_stable: {},
        }),
      },
    }),
  ];
};
