import { Dec, Int, MsgExecuteContract } from '@terra-money/terra.js';
import { validateAddress } from '../../utils/validation/address';
import { validateInput } from '../../utils/validate-input';
import { validateIsNumber } from '../../utils/validation/number';
import { validateTrue } from '../../utils/validation/true';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  collateral_token: string;
  amount: number | null;
}

export const fabricateRetractBid = ({
  address,
  collateral_token,
  amount,
}: Option) => (
  addressProvider: AddressProvider,
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    validateAddress(collateral_token),
    amount ? validateIsNumber(amount) : validateTrue,
  ]);

  const mmContractAddress = addressProvider.liquidation();

  return [
    new MsgExecuteContract(address, mmContractAddress, {
      // @see https://github.com/Anchor-Protocol/money-market-contracts/blob/781abf462dc25aaed0ea4953dad14ba9736fa55d/contracts/liquidation/src/bid.rs#L15
      retract_bid: {
        collateral_token: collateral_token,
        amount:
          new Int(new Dec(amount as number).mul(1000000)).toString() ||
          undefined,
      },
    }),
  ];
};
