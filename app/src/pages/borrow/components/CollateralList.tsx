import {
  demicrofy,
  formatLuna,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { UST } from '@anchor-protocol/types';
import {
  useBorrowBorrowerQuery,
  useBorrowLiquidationPriceQuery,
  useBorrowMarketQuery,
} from '@anchor-protocol/webapp-provider';
import { BorderButton } from '@terra-dev/neumorphism-ui/components/BorderButton';
import { HorizontalScrollTable } from '@terra-dev/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { useMemo } from 'react';
import { collaterals as _collaterals } from '../logics/collaterals';
import { useProvideCollateralDialog } from './useProvideCollateralDialog';
import { useRedeemCollateralDialog } from './useRedeemCollateralDialog';

export interface CollateralListProps {
  className?: string;
}

export function CollateralList({ className }: CollateralListProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { data: borrowMarket } = useBorrowMarketQuery();

  const { data: borrowBorrower } = useBorrowBorrowerQuery();

  const { data: { liquidationPrice } = {} } = useBorrowLiquidationPriceQuery();

  const [
    openProvideCollateralDialog,
    provideCollateralDialogElement,
  ] = useProvideCollateralDialog();

  const [
    openRedeemCollateralDialog,
    redeemCollateralDialogElement,
  ] = useRedeemCollateralDialog();

  const collaterals = useMemo(
    () => _collaterals(borrowBorrower?.custodyBorrower, 1 as UST<number>),
    [borrowBorrower?.custodyBorrower],
  );

  const collateralsInUST = useMemo(
    () =>
      _collaterals(
        borrowBorrower?.custodyBorrower,
        borrowMarket?.oraclePrice.rate,
      ),
    [borrowBorrower?.custodyBorrower, borrowMarket?.oraclePrice.rate],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
      <HorizontalScrollTable minWidth={850}>
        <colgroup>
          <col style={{ width: 200 }} />
          <col style={{ width: 200 }} />
          <col style={{ width: 200 }} />
          <col style={{ width: 250 }} />
        </colgroup>
        <thead>
          <tr>
            <th>COLLATERAL LIST</th>
            <th>
              <IconSpan>
                Price{' '}
                <InfoTooltip>
                  Current price of bAsset / Price of bAsset that will trigger
                  liquidation of current loan
                </InfoTooltip>
              </IconSpan>
            </th>
            <th>
              <IconSpan>
                Provided{' '}
                <InfoTooltip>
                  Value of bAsset collateral deposited by user / Amount of
                  bAsset collateral deposited by user
                </InfoTooltip>
              </IconSpan>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <i>
                <TokenIcon token="bluna" />
              </i>
              <div>
                <div className="coin">bLuna</div>
                <p className="name">Bonded Luna</p>
              </div>
            </td>
            <td>
              <div className="value">
                {borrowMarket?.oraclePrice
                  ? formatUSTWithPostfixUnits(borrowMarket.oraclePrice.rate)
                  : 0}{' '}
                UST
              </div>
              <p className="volatility">
                {liquidationPrice
                  ? formatUSTWithPostfixUnits(liquidationPrice)
                  : 0}{' '}
                UST
              </p>
            </td>
            <td>
              <div className="value">
                {formatUSTWithPostfixUnits(demicrofy(collateralsInUST))} UST
              </div>
              <p className="volatility">
                {formatLuna(demicrofy(collaterals))} bLUNA
              </p>
            </td>
            <td>
              <BorderButton
                disabled={!connectedWallet || !borrowMarket || !borrowBorrower}
                onClick={() =>
                  borrowMarket &&
                  borrowBorrower &&
                  openProvideCollateralDialog({
                    fallbackBorrowMarket: borrowMarket,
                    fallbackBorrowBorrower: borrowBorrower,
                  })
                }
              >
                Provide
              </BorderButton>
              <BorderButton
                disabled={
                  !connectedWallet ||
                  !borrowMarket ||
                  !borrowBorrower ||
                  (big(borrowBorrower.custodyBorrower.balance)
                    .minus(borrowBorrower.custodyBorrower.spendable)
                    .eq(0) &&
                    big(borrowBorrower.marketBorrowerInfo.loan_amount).lte(0))
                }
                onClick={() =>
                  borrowMarket &&
                  borrowBorrower &&
                  openRedeemCollateralDialog({
                    fallbackBorrowMarket: borrowMarket,
                    fallbackBorrowBorrower: borrowBorrower,
                  })
                }
              >
                Withdraw
              </BorderButton>
            </td>
          </tr>
        </tbody>
      </HorizontalScrollTable>

      {provideCollateralDialogElement}
      {redeemCollateralDialogElement}
    </Section>
  );
}
