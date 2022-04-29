import {
  computeBorrowedAmount,
  computeBorrowLimit,
  computeLtv,
} from '@anchor-protocol/app-fns';
import {
  ANCHOR_TX_KEY,
  useAnchorWebapp,
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
} from '@anchor-protocol/app-provider';
import { formatInput, formatOutput } from '@anchor-protocol/formatter';
import { bAsset, bLuna, u } from '@anchor-protocol/types';
import {
  pickAttributeValue,
  pickEvent,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import { pickLog } from '@libs/app-fns/queries/utils';
import { TxHelper } from '@libs/app-fns/tx/internal';
import { useRefetchQueries } from '@libs/app-provider';
import { demicrofy, formatRate, microfy } from '@libs/formatter';
import { TxInfo } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraSdk } from 'crossanchor';
import { WhitelistCollateral } from 'queries';
import { useCallback } from 'react';
import { useRenderedTx } from './useRenderedTx';

export interface ProvideCollateralTxParams {
  amount: bAsset;
}

export function useProvideCollateralTx(collateral: WhitelistCollateral) {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const { refetch: borrowMarketQuery } = useBorrowMarketQuery();
  const { refetch: borrowBorrowerQuery } = useBorrowBorrowerQuery();

  const sendTx = useCallback(
    async (txParams: ProvideCollateralTxParams, helper: TxHelper) => {
      const result = await terraSdk.lockCollateral(
        collateral.collateral_token,
        collateral.custody_contract,
        formatInput(
          microfy(txParams.amount, collateral.decimals),
          collateral.decimals,
        ),
        connectedWallet!.walletAddress,
        {
          handleEvent: (event) => {
            helper.setTxHash(event.payload.txHash);
          },
        },
      );

      refetchQueries(ANCHOR_TX_KEY.BORROW_PROVIDE_COLLATERAL);

      return result;
    },
    [connectedWallet, refetchQueries, terraSdk, collateral],
  );

  const renderResults = useCallback(
    async (txInfo: TxInfo, helper: TxHelper) => {
      const { data: borrowMarket } = await borrowMarketQuery();
      const { data: borrowBorrower } = await borrowBorrowerQuery();

      if (!borrowMarket || !borrowBorrower) {
        return helper.failedToCreateReceipt(
          new Error('Failed to load borrow data'),
        );
      }

      const rawLog = pickLog(txInfo, 1);

      if (!rawLog) {
        return helper.failedToFindRawLog();
      }

      const fromContract = pickEvent(rawLog, 'from_contract');

      if (!fromContract) {
        return helper.failedToFindEvents('from_contract');
      }

      try {
        const collateralizedAmount = pickAttributeValue<u<bLuna>>(
          fromContract,
          7,
        );

        const ltv = computeLtv(
          computeBorrowLimit(
            borrowBorrower.overseerCollaterals,
            borrowMarket.oraclePrices,
            borrowMarket.bAssetLtvs,
          ),
          computeBorrowedAmount(borrowBorrower.marketBorrowerInfo),
        );

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            collateralizedAmount && {
              name: 'Collateralized Amount',
              value: `${formatOutput(
                demicrofy(collateralizedAmount, collateral.decimals),
                { decimals: collateral.decimals },
              )} ${collateral.symbol}`,
            },
            ltv && {
              name: 'New Borrow Usage',
              value: formatRate(ltv) + ' %',
            },
            helper.txHashReceipt(),
            helper.txFeeReceipt(),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
    [borrowBorrowerQuery, borrowMarketQuery, collateral],
  );

  const streamReturn = useRenderedTx({
    sendTx,
    renderResults,
    network: connectedWallet!.network,
    txFee: terraSdk.globalOverrides.gasFee.toString(),
    txErrorReporter,
  });

  return connectedWallet ? streamReturn : [null, null];
}
