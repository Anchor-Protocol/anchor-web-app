import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  formatLuna,
  formatUSTWithPostfixUnits,
  MICRO,
} from '@anchor-protocol/notation';
import { Error } from '@material-ui/icons';
import big from 'big.js';
import { Data as MarketOverview } from 'pages/borrow/queries/marketOverview';
import { useMemo } from 'react';
import styled from 'styled-components';
import { useBorrowDialog } from './useBorrowDialog';

export interface CollateralListProps {
  className?: string;
  marketOverview: MarketOverview | undefined;
}

function CollateralListBase({
  className,
  marketOverview,
}: CollateralListProps) {
  const [openBorrowDialog, borrowDialogElement] = useBorrowDialog();

  //console.log('CollateralList.tsx..CollateralListBase()', );
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
              <ActionButton onClick={() => openBorrowDialog({})}>
                Add
              </ActionButton>
              <ActionButton>Withdraw</ActionButton>
            </td>
          </tr>
        </tbody>
      </HorizontalScrollTable>

      {borrowDialogElement}
    </Section>
  );
}

export const CollateralList = styled(CollateralListBase)`
  // TODO
`;
