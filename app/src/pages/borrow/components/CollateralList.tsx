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
import { useProvideCollateralDialog } from 'pages/borrow/components/useProvideCollateralDialog';
import { useRedeemCollateralDialog } from 'pages/borrow/components/useRedeemCollateralDialog';
import { Data as MarketOverview } from 'pages/borrow/queries/marketOverview';
import { useMemo } from 'react';
import styled from 'styled-components';

export interface CollateralListProps {
  className?: string;
  marketOverview: MarketOverview | undefined;
}

function CollateralListBase({
  className,
  marketOverview,
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

  const collaterals = useMemo(() => {
    return big(
      big(marketOverview?.borrowInfo.balance ?? 0).minus(
        marketOverview?.borrowInfo.spendable ?? 0,
      ),
    ).div(MICRO);
  }, [
    marketOverview?.borrowInfo.balance,
    marketOverview?.borrowInfo.spendable,
  ]);

  const collateralsInUST = useMemo(() => {
    return big(big(collaterals).mul(marketOverview?.oraclePrice.rate ?? 1)).div(
      MICRO,
    );
  }, [collaterals, marketOverview?.oraclePrice.rate]);

  //console.log('CollateralList.tsx..CollateralListBase()', {marketOverview});

  return (
    <Section className={`collateral-list ${className}`}>
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
                {formatUSTWithPostfixUnits(collateralsInUST)} UST
              </div>
              <p className="volatility">{formatLuna(collaterals)} bLUNA</p>
            </td>
            <td>
              <ActionButton
                disabled={status.status !== 'ready' || !marketOverview}
                onClick={() =>
                  openProvideCollateralDialog({
                    marketOverview: marketOverview!,
                  })
                }
              >
                Add
              </ActionButton>
              <ActionButton
                disabled={status.status !== 'ready' || !marketOverview}
                onClick={() =>
                  openRedeemCollateralDialog({
                    marketOverview: marketOverview!,
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
