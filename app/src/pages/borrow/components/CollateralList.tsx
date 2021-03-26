import {
  demicrofy,
  formatLuna,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { UST } from '@anchor-protocol/types';
import { useConnectedWallet } from '@anchor-protocol/wallet-provider';
import { BorderButton } from '@terra-dev/neumorphism-ui/components/BorderButton';
import { HorizontalScrollTable } from '@terra-dev/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import big from 'big.js';
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

  const connectedWallet = useConnectedWallet();

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
    () => _collaterals(borrowInfo, 1 as UST<number>),
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
                {formatUSTWithPostfixUnits(demicrofy(collateralsInUST))} UST
              </div>
              <p className="volatility">
                {formatLuna(demicrofy(collaterals))} bLUNA
              </p>
            </td>
            <td>
              <BorderButton
                disabled={!connectedWallet || !ready}
                onClick={() => {
                  refetch();
                  openProvideCollateralDialog({});
                }}
              >
                Provide
              </BorderButton>
              <BorderButton
                disabled={
                  !connectedWallet ||
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
