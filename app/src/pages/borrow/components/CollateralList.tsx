import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  demicrofy,
  formatLuna,
  formatUSTWithPostfixUnits,
  Ratio,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { useWallet } from '@anchor-protocol/wallet-provider';
import big from 'big.js';
import { useMarket } from 'pages/borrow/context/market';
import { useCollaterals } from 'pages/borrow/logics/useCollaterals';
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
  const collaterals = useCollaterals(
    borrowInfo?.balance,
    borrowInfo?.spendable,
    1 as Ratio<number>,
  );
  const collateralsInUST = useCollaterals(
    borrowInfo?.balance,
    borrowInfo?.spendable,
    oraclePrice?.rate,
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
      <HorizontalScrollTable>
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
              <ActionButton
                disabled={status.status !== 'ready' || !ready}
                onClick={() => {
                  refetch();
                  openProvideCollateralDialog({});
                }}
              >
                Provide
              </ActionButton>
              <ActionButton
                disabled={
                  status.status !== 'ready' ||
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
