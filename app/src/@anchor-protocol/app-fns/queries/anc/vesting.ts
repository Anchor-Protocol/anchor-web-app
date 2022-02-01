import { anchorToken, HumanAddr } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface AncVestingAccountWasmQuery {
  vestingAccount: WasmQuery<
    anchorToken.vesting.VestingAccount,
    anchorToken.vesting.VestingAccountResponse
  >;
}

export type AncVestingAccount = WasmQueryData<AncVestingAccountWasmQuery>;

export async function ancVestingAccountQuery(
  address: HumanAddr | undefined,
  ancVestingAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<AncVestingAccount | undefined> {
  if (!address) {
    return undefined;
  }
  return wasmFetch<AncVestingAccountWasmQuery>({
    ...queryClient,
    id: `anc--vesting-account-${address}`,
    wasmQuery: {
      vestingAccount: {
        contractAddress: ancVestingAddr,
        query: {
          vesting_account: {
            address: address,
          },
        },
      },
    },
  });
}
