import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider';
import { WalletStatus } from '@anchor-protocol/wallet-provider';
import { ApolloClient } from '@apollo/client';
import {
  Data as MarketBalance,
  queryMarketBalanceOverview,
} from 'pages/borrow/queries/marketBalanceOverview';
import {
  Data as MarketOverview,
  queryMarketOverview,
} from 'pages/borrow/queries/marketOverview';
import {
  Data as MarketUserOverview,
  queryMarketUserOverview,
} from 'pages/borrow/queries/marketUserOverview';
import { Data } from 'queries/txInfos';
import { TxResult } from 'transactions/tx';

export const refetchMarket = (
  addressProvider: AddressProvider,
  client: ApolloClient<any>,
  walletStatus: WalletStatus,
) => async ({
  txInfo,
  txResult,
}: {
  txResult: TxResult;
  txInfo: Data;
}): Promise<{
  txResult: TxResult;
  txInfo: Data;
  marketBalance: MarketBalance;
  marketOverview: MarketOverview;
  marketUserOverview: MarketUserOverview;
}> => {
  const { parsedData: marketBalance } = await queryMarketBalanceOverview(
    client,
    addressProvider,
  );
  const [
    { parsedData: marketUserOverview },
    { parsedData: marketOverview },
  ] = await Promise.all([
    queryMarketUserOverview(
      client,
      addressProvider,
      walletStatus,
      marketBalance,
    ),
    queryMarketOverview(client, addressProvider, marketBalance),
  ]);

  return {
    txInfo,
    txResult,
    marketBalance,
    marketOverview,
    marketUserOverview,
  };
};
