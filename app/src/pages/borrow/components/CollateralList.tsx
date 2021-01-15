import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  formatLuna,
  formatUSTWithPostfixUnits,
  MICRO,
} from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { Error } from '@material-ui/icons';
import big from 'big.js';
import { useMemo } from 'react';
import styled from 'styled-components';
import { Data as MarketOverview } from '../queries/marketOverview';
import { Data as MarketUserOverview } from '../queries/marketUserOverview';
import { useProvideCollateralDialog } from './useProvideCollateralDialog';
import { useRedeemCollateralDialog } from './useRedeemCollateralDialog';

export interface CollateralListProps {
  className?: string;
  marketOverview: MarketOverview | undefined;
  marketUserOverview: MarketUserOverview | undefined;
}

function CollateralListBase({
  className,
  marketOverview,
  marketUserOverview,
}: CollateralListProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status } = useWallet();

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
  const collaterals = useMemo(() => {
    return big(marketUserOverview?.borrowInfo.balance ?? 0).minus(
        marketUserOverview?.borrowInfo.spendable ?? 0,
      );
  }, [
    marketUserOverview?.borrowInfo.balance,
    marketUserOverview?.borrowInfo.spendable,
  ]);

  const collateralsInUST = useMemo(() => {
    return big(collaterals).mul(marketOverview?.oraclePrice.rate ?? 1);
  }, [collaterals, marketOverview?.oraclePrice.rate]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
      <h2>COLLATERAL LIST</h2>

      <HorizontalScrollTable>
        <colgroup>
          <col style={{ width: 300 }} />
          <col style={{ width: 200 }} />
          <col style={{ width: 200 }} />
        </colgroup>
        <thead>
          <tr>
            <th>Name</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <i>
                <Error />
              </i>
              <div>
                <div className="coin">bLuna</div>
                <p className="name">Bonded Luna</p>
              </div>
            </td>
            <td>
              <div className="value">
                {formatUSTWithPostfixUnits(collateralsInUST.div(MICRO))} UST
              </div>
              <p className="volatility">
                {formatLuna(collaterals.div(MICRO))} bLUNA
              </p>
            </td>
            <td>
              <ActionButton
                disabled={
                  status.status !== 'ready' ||
                  !marketOverview ||
                  !marketUserOverview
                }
                onClick={() =>
                  openProvideCollateralDialog({
                    marketOverview: marketOverview!,
                    marketUserOverview: marketUserOverview!,
                  })
                }
              >
                Add
              </ActionButton>
              <ActionButton
                disabled={
                  status.status !== 'ready' ||
                  !marketOverview ||
                  !marketUserOverview ||
                  (big(marketUserOverview.borrowInfo.balance)
                    .minus(marketUserOverview.borrowInfo.spendable)
                    .eq(0) &&
                    big(marketUserOverview.loanAmount.loan_amount).lte(0))
                }
                onClick={() =>
                  openRedeemCollateralDialog({
                    marketOverview: marketOverview!,
                    marketUserOverview: marketUserOverview!,
                  })
                }
              >
                Withdraw
              </ActionButton>
            </td>
          </tr>
        </tbody>
      </HorizontalScrollTable>

      {provideCollateralDialogElement}
      {redeemCollateralDialogElement}
    </Section>
  );
}

export const CollateralList = styled(CollateralListBase)`
  // TODO
`;
