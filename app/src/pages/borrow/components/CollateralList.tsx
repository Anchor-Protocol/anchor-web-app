import { BorderButton } from '@anchor-protocol/neumorphism-ui/components/BorderButton';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  demicrofy,
  formatLuna,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { Rate } from '@anchor-protocol/types';
import big from 'big.js';
import { useService } from 'contexts/service';
import { useMemo } from 'react';
import { useMarket } from '../context/market';
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
  const { ready, borrowInfo, oraclePrice, loanAmount, refetch } = useMarket();

  const { serviceAvailable } = useService();

  const [
    openProvideCollateralDialog,
    provideCollateralDialogElement,
  ] = useProvideCollateralDialog();

  const [
    openRedeemCollateralDialog,
    redeemCollateralDialogElement,
  ] = useRedeemCollateralDialog();

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const collaterals = useMemo(
    () => _collaterals(borrowInfo, 1 as Rate<number>),
    [borrowInfo],
  );

  const collateralsInUST = useMemo(
    () => _collaterals(borrowInfo, oraclePrice?.rate),
    [borrowInfo, oraclePrice?.rate],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
      <HorizontalScrollTable minWidth={700}>
        <colgroup>
          <col style={{ width: 300 }} />
          <col style={{ width: 200 }} />
          <col style={{ width: 200 }} />
        </colgroup>
        <thead>
          <tr>
            <th>COLLATERAL LIST</th>
            <th>
              <IconSpan>
                Provided{' '}
                <InfoTooltip>
                  Amount of bAsset collateral deposited by user, in USD / Amount
                  of bAsset collateral deposited by user
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
                <TokenIcon token="bluna" variant="@2x" />
              </i>
              <div>
                <div className="coin">bLuna</div>
                <p className="name">Bonded Luna</p>
              </div>
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
                disabled={!serviceAvailable || !ready}
                onClick={() => {
                  refetch();
                  openProvideCollateralDialog({});
                }}
              >
                Provide
              </BorderButton>
              <BorderButton
                disabled={
                  !serviceAvailable ||
                  !ready ||
                  !borrowInfo ||
                  !loanAmount ||
                  (big(borrowInfo.balance).minus(borrowInfo.spendable).eq(0) &&
                    big(loanAmount.loan_amount).lte(0))
                }
                onClick={() => {
                  refetch();
                  openRedeemCollateralDialog({});
                }}
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
