import { Dec, MsgExecuteContract } from '@terra-money/terra.js';
import { validateAddress } from '../../utils/validation/address';
import { validateInput } from '../../utils/validate-input';
import { validateTrue } from '../../utils/validation/true';
import { validateIsNumber } from '../../utils/validation/number';
import { AddressProvider } from '../../address-provider/provider';

interface Option {
  address: string;
  owner?: string;
  oracle_contract?: string;
  stable_denom?: string;
  safe_ratio?: Dec;
  bid_fee?: Dec;
  max_premium_rate?: Dec;
  liquidation_threshold?: number;
  price_timeframe?: number;
}

export const fabricateLiquidationConfig = ({
  address,
  owner,
  oracle_contract,
  stable_denom,
  safe_ratio,
  bid_fee,
  max_premium_rate,
  liquidation_threshold,
  price_timeframe,
}: Option) => (
  addressProvider: AddressProvider,
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    owner ? validateAddress(owner) : validateTrue,
    oracle_contract ? validateAddress(oracle_contract) : validateTrue,
    liquidation_threshold
      ? validateIsNumber(liquidation_threshold)
      : validateTrue,
    price_timeframe ? validateIsNumber(price_timeframe) : validateTrue,
  ]);

  const mmContractAddress = addressProvider.liquidation();

  return [
    new MsgExecuteContract(address, mmContractAddress, {
      update_config: {
        owner: owner,
        oracle_contract: oracle_contract,
        stable_denom: stable_denom,
        safe_ratio: safe_ratio,
        bid_fee: bid_fee,
        max_premium_rate: max_premium_rate,
        liquidation_threshold: liquidation_threshold,
        price_timeframe: price_timeframe,
      },
    }),
  ];
};
