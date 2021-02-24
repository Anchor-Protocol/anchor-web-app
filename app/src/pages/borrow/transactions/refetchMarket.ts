import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider';
import { WalletStatus } from '@anchor-protocol/wallet-provider';
import { ApolloClient } from '@apollo/client';
import {
  Data as MarketOverview,
  queryMarketOverview,
} from '../queries/marketOverview';
import { Data as MarketState, queryMarketState } from '../queries/marketState';
import {
  Data as MarketUserOverview,
  queryMarketUserOverview,
} from '../queries/marketUserOverview';

export const refetchMarket = (
  addressProvider: AddressProvider,
  client: ApolloClient<any>,
  walletStatus: WalletStatus,
) => async (_: {}): Promise<{
  currentBlock?: MarketState['currentBlock'];
  marketBalance?: MarketState['marketBalance'];
  marketState?: MarketState['marketState'];
  borrowRate?: MarketOverview['borrowRate'];
  oraclePrice?: MarketOverview['oraclePrice'];
  overseerWhitelist?: MarketOverview['overseerWhitelist'];
  loanAmount?: MarketUserOverview['loanAmount'];
  borrowInfo?: MarketUserOverview['borrowInfo'];
}> => {
  const {
    data: { currentBlock, marketBalance, marketState },
  } = await queryMarketState(client, addressProvider);

  if (typeof currentBlock !== 'number' || !marketBalance || !marketState) {
    return {};
  }

  const [
    {
      data: { borrowRate, oraclePrice, overseerWhitelist },
    },
    {
      data: { loanAmount, borrowInfo },
    },
  ] = await Promise.all([
    queryMarketOverview(client, addressProvider, marketBalance, marketState),
    queryMarketUserOverview(
      client,
      addressProvider,
      walletStatus,
      currentBlock,
    ),
  ]);

  return {
    currentBlock,
    marketBalance,
    marketState,
    borrowRate,
    oraclePrice,
    overseerWhitelist,
    loanAmount,
    borrowInfo,
  };
};
