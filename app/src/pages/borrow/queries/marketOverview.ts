import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider';
import { useQuerySubscription } from '@anchor-protocol/use-broadcastable-query';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { gql, QueryResult, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useMemo } from 'react';
import {
  Data as MarketBalanceData,
  useMarketBalanceOverview,
} from './marketBalanceOverview';

export interface StringifiedData {
  borrowRate: {
    Result: string;
  };

  loanAmount: {
    Result: string;
  };

  oraclePrice: {
    Result: string;
  };

  borrowInfo: {
    Result: string;
  };

  overseerWhitelist: {
    Result: string;
  };
}

export interface Data {
  borrowRate: {
    rate: string;
  };

  loanAmount: {
    borrower: string;
    loan_amount: string;
  };

  oraclePrice: {
    rate: string;
    last_updated_base: number;
    last_updated_quote: number;
  };

  borrowInfo: {
    borrower: string;
    balance: string;
    spendable: string;
  };

  overseerWhitelist: {
    elems: {
      collateral_token: string;
      custody_contract: string;
      ltv: string;
    }[];
  };

  bLunaMaxLtv: string;
}

export function parseData(
  {
    borrowRate,
    loanAmount,
    oraclePrice,
    borrowInfo,
    overseerWhitelist,
  }: StringifiedData,
  addressProvider: AddressProvider,
): Data {
  const parsedOverseerWhitelist: Data['overseerWhitelist'] = JSON.parse(
    overseerWhitelist.Result,
  );
  const bLunaMaxLtv = parsedOverseerWhitelist.elems.find(
    ({ collateral_token }) =>
      collateral_token === addressProvider.bAssetToken('ubluna'),
  )?.ltv;

  if (!bLunaMaxLtv) {
    throw new Error(`Undefined bLuna collateral token!`);
  }

  return {
    borrowRate: JSON.parse(borrowRate.Result),
    loanAmount: JSON.parse(loanAmount.Result),
    oraclePrice: JSON.parse(oraclePrice.Result),
    borrowInfo: JSON.parse(borrowInfo.Result),
    overseerWhitelist: parsedOverseerWhitelist,
    bLunaMaxLtv,
  };
}

export interface StringifiedVariables {
  interestContractAddress: string;
  interestBorrowRateQuery: string;
  marketContractAddress: string;
  marketLoanQuery: string;
  oracleContractAddress: string;
  oracleQuery: string;
  custodyContractAddress: string;
  custodyBorrowerQuery: string;
  overseerContractAddress: string;
  overseerWhitelistQuery: string;
}

export interface Variables {
  interestContractAddress: string;
  interestBorrowRateQuery: {
    borrow_rate: {
      market_balance: string;
      total_liabilities: string;
      total_reserves: string;
    };
  };
  marketContractAddress: string;
  marketLoanQuery: {
    loan_amount: {
      borrower: string;
      block_height: number;
    };
  };
  oracleContractAddress: string;
  oracleQuery: {
    price: {
      base: string;
      quote: string;
    };
  };
  custodyContractAddress: string;
  custodyBorrowerQuery: {
    borrower: {
      address: string;
    };
  };
  overseerContractAddress: string;
  overseerWhitelistQuery: {
    whitelist: {
      collateral_token: string;
    };
  };
}

export function stringifyVariables({
  interestContractAddress,
  interestBorrowRateQuery,
  marketContractAddress,
  marketLoanQuery,
  oracleContractAddress,
  oracleQuery,
  custodyContractAddress,
  custodyBorrowerQuery,
  overseerContractAddress,
  overseerWhitelistQuery,
}: Variables): StringifiedVariables {
  return {
    interestContractAddress,
    interestBorrowRateQuery: JSON.stringify(interestBorrowRateQuery),
    marketContractAddress,
    marketLoanQuery: JSON.stringify(marketLoanQuery),
    oracleContractAddress,
    oracleQuery: JSON.stringify(oracleQuery),
    custodyContractAddress,
    custodyBorrowerQuery: JSON.stringify(custodyBorrowerQuery),
    overseerContractAddress,
    overseerWhitelistQuery: JSON.stringify(overseerWhitelistQuery),
  };
}

export const query = gql`
  query(
    $interestContractAddress: String!
    $interestBorrowRateQuery: String!
    $marketContractAddress: String!
    $marketLoanQuery: String!
    $oracleContractAddress: String!
    $oracleQuery: String!
    $custodyContractAddress: String!
    $custodyBorrowerQuery: String!
    $overseerContractAddress: String!
    $overseerWhitelistQuery: String!
  ) {
    borrowRate: WasmContractsContractAddressStore(
      ContractAddress: $interestContractAddress
      QueryMsg: $interestBorrowRateQuery
    ) {
      Result
    }

    loanAmount: WasmContractsContractAddressStore(
      ContractAddress: $marketContractAddress
      QueryMsg: $marketLoanQuery
    ) {
      Result
    }

    oraclePrice: WasmContractsContractAddressStore(
      ContractAddress: $oracleContractAddress
      QueryMsg: $oracleQuery
    ) {
      Result
    }

    borrowInfo: WasmContractsContractAddressStore(
      ContractAddress: $custodyContractAddress
      QueryMsg: $custodyBorrowerQuery
    ) {
      Result
    }

    overseerWhitelist: WasmContractsContractAddressStore(
      ContractAddress: $overseerContractAddress
      QueryMsg: $overseerWhitelistQuery
    ) {
      Result
    }
  }
`;

export function useMarketOverview(): QueryResult<
  StringifiedData,
  StringifiedVariables
> & {
  parsedData: Data | undefined;
  marketBalance: MarketBalanceData | undefined;
} {
  const addressProvider = useAddressProvider();
  const { status } = useWallet();

  const { parsedData: marketBalance } = useMarketBalanceOverview();

  const result = useQuery<StringifiedData, StringifiedVariables>(query, {
    skip: status.status !== 'ready' || !marketBalance,
    fetchPolicy: 'cache-and-network',
    variables: stringifyVariables({
      interestContractAddress: addressProvider.interest(),
      interestBorrowRateQuery: {
        borrow_rate: {
          market_balance:
            marketBalance?.marketBalance.find(({ Denom }) => Denom === 'uusd')
              ?.Amount ?? '',
          total_liabilities: marketBalance?.marketState.total_liabilities ?? '',
          total_reserves: marketBalance?.marketState.total_reserves ?? '',
        },
      },
      marketContractAddress: addressProvider.market('uusd'),
      marketLoanQuery: {
        loan_amount: {
          borrower: status.status === 'ready' ? status.walletAddress : '',
          block_height: marketBalance?.currentBlock ?? 0,
        },
      },
      oracleContractAddress: addressProvider.oracle(),
      oracleQuery: {
        price: {
          base: addressProvider.bAssetToken('ubluna'),
          quote: 'uusd',
        },
      },
      custodyContractAddress: addressProvider.custody('ubluna'),
      custodyBorrowerQuery: {
        borrower: {
          address: status.status === 'ready' ? status.walletAddress : '',
        },
      },
      overseerContractAddress: addressProvider.overseer('ubluna'),
      overseerWhitelistQuery: {
        whitelist: {
          collateral_token: addressProvider.bAssetToken('ubluna'),
        },
      },
    }),
  });

  useQuerySubscription(
    (id, event) => {
      if (event === 'done') {
        result.refetch();
      }
    },
    [result.refetch],
  );

  //console.log('marketOverview.ts..useMarketOverview()', {marketBalance, data: result.data, error: result.error});

  const parsedData = useMemo(
    () => (result.data ? parseData(result.data, addressProvider) : undefined),
    [addressProvider, result.data],
  );

  return {
    ...result,
    parsedData,
    marketBalance,
  };
}
