import { ContractAddress, moneyMarket } from '@anchor-protocol/types';
import { WalletStatus } from '@anchor-protocol/wallet-provider';
import { ApolloClient } from '@apollo/client';
import { queryMarketOverview } from '../queries/marketOverview';
import { queryMarketState } from '../queries/marketState';
import { queryMarketUserOverview } from '../queries/marketUserOverview';

export const refetchMarket = (
  address: ContractAddress,
  client: ApolloClient<any>,
  walletStatus: WalletStatus,
) => async (_: {}): Promise<{
  marketState?: moneyMarket.market.StateResponse;
  borrowRate?: moneyMarket.interestModel.BorrowRateResponse;
  oraclePrice?: moneyMarket.oracle.PriceResponse;
  overseerWhitelist?: moneyMarket.overseer.WhitelistResponse;
  loanAmount?: moneyMarket.market.BorrowerInfoResponse;
  borrowInfo?: moneyMarket.custody.BorrowerResponse;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

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
    marketState,
    borrowRate,
    oraclePrice,
    overseerWhitelist,
    loanAmount,
    borrowInfo,
  };
};
