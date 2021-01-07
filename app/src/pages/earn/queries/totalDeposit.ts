import { gql } from '@apollo/client';
import big from 'big.js';

export interface StringifiedData {
  aUSTBalance: {
    Result: string;
  };
  exchangeRate: {
    Result: string;
  };
}

export interface Data {
  aUSTBalance: {
    balance: string;
  };
  exchangeRate: {
    a_token_supply: string;
    exchange_rate: string;
  };
  totalDeposit: string;
}

export function parseData({
  aUSTBalance,
  exchangeRate,
}: StringifiedData): Data {
  const parsedAUSTBalance: Data['aUSTBalance'] = JSON.parse(aUSTBalance.Result);
  const parsedExchangeRate: Data['exchangeRate'] = JSON.parse(
    exchangeRate.Result,
  );
  return {
    aUSTBalance: parsedAUSTBalance,
    exchangeRate: parsedExchangeRate,
    totalDeposit: big(parsedAUSTBalance.balance)
      .mul(parsedExchangeRate.exchange_rate)
      .toString(),
  };
}

export interface StringifiedVariables {
  anchorTokenContract: string;
  anchorTokenBalanceQuery: string;
  moneyMarketContract: string;
  moneyMarketEpochQuery: string;
}

export interface Variables {
  anchorTokenContract: string;
  anchorTokenBalanceQuery: {
    balance: {
      address: string;
    };
  };
  moneyMarketContract: string;
  moneyMarketEpochQuery: {
    epoch_state: {};
  };
}

export function stringifyVariables({
  anchorTokenContract,
  anchorTokenBalanceQuery,
  moneyMarketContract,
  moneyMarketEpochQuery,
}: Variables): StringifiedVariables {
  return {
    anchorTokenContract,
    anchorTokenBalanceQuery: JSON.stringify(anchorTokenBalanceQuery),
    moneyMarketContract,
    moneyMarketEpochQuery: JSON.stringify(moneyMarketEpochQuery),
  };
}

export const query = gql`
  query earnTotalDeposit(
    $anchorTokenContract: String!
    $anchorTokenBalanceQuery: String!
    $moneyMarketContract: String!
    $moneyMarketEpochQuery: String!
  ) {
    aUSTBalance: WasmContractsContractAddressStore(
      ContractAddress: $anchorTokenContract
      QueryMsg: $anchorTokenBalanceQuery
    ) {
      Result
    }

    exchangeRate: WasmContractsContractAddressStore(
      ContractAddress: $moneyMarketContract
      QueryMsg: $moneyMarketEpochQuery
    ) {
      Result
    }
  }
`;
