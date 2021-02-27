import { ContractAddress } from '@anchor-protocol/types';
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
  address: ContractAddress,
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
  } = await queryMarketState(client, address);

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
    queryMarketOverview(client, address, marketBalance, marketState),
    queryMarketUserOverview(client, address, walletStatus, currentBlock),
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
