import { AddressProvider } from '@anchor-protocol/anchor.js/address-provider';
import { MsgExecuteContract } from '@terra-money/terra.js';

export const createContractMsg = (addressProvider: AddressProvider) => (
  fn: (AddressProvider: AddressProvider) => MsgExecuteContract[],
) => fn(addressProvider);
