import { gql } from '@apollo/client';
import { testAddressProvider, testClient, testWalletAddress } from 'env.test';

export const query = gql`
  query(
    $userAddress: String!
    $bAssetTokenAddress: String!
    $bAssetTokenBalanceQuery: String!
    $aAssetTokenAddress: String!
    $aAssetTokenBalanceQuery: String!
  ) {
    # uluna, ukrt, uust... (user terra station wallet)
    bankBalances: BankBalancesAddress(Address: $userAddress) {
      Result {
        Denom
        Amount
      }
    }

    # ubluna (user gives uluna and get ubluna)
    bLunaBalance: WasmContractsContractAddressStore(
      ContractAddress: $bAssetTokenAddress
      QueryMsg: $bAssetTokenBalanceQuery
    ) {
      Result
    }

    # TODO what is anchor token?
    # uaust (user gives uust and get uaust ???)
    # is aust like printed number on the bank account?
    aUSTBalance: WasmContractsContractAddressStore(
      ContractAddress: $aAssetTokenAddress
      QueryMsg: $aAssetTokenBalanceQuery
    ) {
      Result
    }
  }
`;

describe('queries/balances', () => {
  test('should get result from query', async () => {
    const data = await testClient.query({
      query,
      variables: {
        userAddress: testWalletAddress,
        bAssetTokenAddress: testAddressProvider.bAssetToken(''),
        bAssetTokenBalanceQuery: JSON.stringify({
          balance: { address: testWalletAddress },
        }),
        aAssetTokenAddress: testAddressProvider.aToken(),
        aAssetTokenBalanceQuery: JSON.stringify({
          balance: { address: testWalletAddress },
        }),
      },
    });

    console.log('balances.test.ts..()', data);
  });
});
