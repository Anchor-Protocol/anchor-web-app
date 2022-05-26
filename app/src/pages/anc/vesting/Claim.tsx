import { useFixedFee } from '@libs/app-provider';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { UIElementProps } from 'components/layouts/UIElementProps';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import React, { useMemo } from 'react';
import { demicrofy } from '@libs/formatter';
import {
  formatUST,
  formatANCWithPostfixUnits,
} from '@anchor-protocol/notation';
import styled from 'styled-components';
import { useAncVestingClaimTx } from '@anchor-protocol/app-provider/tx/anc/ancVestingClaim';
import { StreamStatus } from '@rx-stream/react';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { validateTxFee } from '@anchor-protocol/app-fns';
import { useNavigate } from 'react-router-dom';
import { MessageBox } from 'components/MessageBox';
import { useAncVestingAccountQuery } from '@anchor-protocol/app-provider/queries/anc/vestingClaim';
import { ANC, u } from '@anchor-protocol/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { Dec } from '@terra-money/terra.js';
import { useVestingClaimNotification } from 'components/Header/vesting/VestingClaimNotification';

interface ClaimableListProps {
  totalVestedAmount: u<ANC>;
  claimableAmount: u<ANC>;
}

const ClaimableList = (props: ClaimableListProps) => {
  const { totalVestedAmount, claimableAmount } = props;
  const fixedFee = useFixedFee();
  return (
    <TxFeeList className="receipt">
      <TxFeeListItem label="Total vested amount">
        {formatANCWithPostfixUnits(demicrofy(totalVestedAmount))} ANC
      </TxFeeListItem>
      <TxFeeListItem label="Claimable ANC">
        {formatANCWithPostfixUnits(demicrofy(claimableAmount))} ANC
      </TxFeeListItem>
      <TxFeeListItem label="Tx fee">
        {formatUST(demicrofy(fixedFee))} UST
      </TxFeeListItem>
    </TxFeeList>
  );
};

function ClaimBase(props: UIElementProps) {
  const { className } = props;

  const navigate = useNavigate();

  const connectedWallet = useConnectedWallet();

  const fixedFee = useFixedFee();

  const bank = useAnchorBank();

  const invalidTxFee = useMemo(
    () => validateTxFee(bank.tokenBalances.uUST, fixedFee),
    [bank, fixedFee],
  );

  const { data: { vestingAccount } = {} } = useAncVestingAccountQuery();

  const [vestingClaim, vestingClaimResult] = useAncVestingClaimTx();

  const [, ignoreVestingClaim] = useVestingClaimNotification();

  if (
    vestingClaimResult?.status === StreamStatus.IN_PROGRESS ||
    vestingClaimResult?.status === StreamStatus.DONE
  ) {
    const onExit =
      vestingClaimResult.status === StreamStatus.DONE
        ? () => navigate('/mypage')
        : () => {};

    return (
      <CenteredLayout className={className} maxWidth={800}>
        <Section>
          <TxResultRenderer
            resultRendering={vestingClaimResult.value}
            onExit={onExit}
          />
        </Section>
      </CenteredLayout>
    );
  }

  const totalVestedAmount = vestingAccount?.info.schedules.reduce(
    (previous, current) => {
      return new Dec(current.amount).add(previous);
    },
    new Dec(0),
  );

  const hasAccruedAnc =
    vestingAccount && new Dec(vestingAccount.accrued_anc).gt(0);

  return (
    <CenteredLayout className={className} maxWidth={800}>
      <Section>
        <h1>Claim Vested Amount</h1>
        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}
        <p className="text">
          This account has been affected by the oracle price feeder issue on
          December 9th, and is eligible for claiming ANC through a 2 month
          linear vesting contract.
        </p>
        <ul className="list">
          <li>
            5% vesting boost exists (5% more ANC than amount calculated for
            reimbursement)
          </li>
          <li>
            ANC will be returned back to community fund if unclaimed for 3
            months.
          </li>
        </ul>
        <ClaimableList
          totalVestedAmount={(totalVestedAmount?.toString() ?? '0') as u<ANC>}
          claimableAmount={vestingAccount?.accrued_anc ?? ('0' as u<ANC>)}
        />
        <ViewAddressWarning>
          <ActionButton
            className="submit"
            disabled={
              !connectedWallet ||
              !connectedWallet.availablePost ||
              !vestingClaim ||
              !hasAccruedAnc
            }
            onClick={() => {
              vestingClaim &&
                vestingClaim({
                  onTxSucceed: ignoreVestingClaim,
                });
            }}
          >
            Claim ANC
          </ActionButton>
        </ViewAddressWarning>
      </Section>
    </CenteredLayout>
  );
}

export const Claim = styled(ClaimBase)`
  h1 {
    text-align: center;
    font-size: 27px;
    font-weight: 500;

    margin-bottom: 60px;
  }

  .text {
    font-family: Gotham;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
  }

  .list {
    padding: 16px 32px;
    margin: 20px 0 0 0;
    background-color: ${({ theme }) => theme.hoverBackgroundColor};
    border-radius: 10px;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    text-align: left;
    li:nth-child(1) {
      margin-bottom: 8px;
    }
    li:nth-child(2) {
      margin-top: 8px;
    }
  }

  .receipt {
    margin: 30px 0 40px 0;
  }

  .submit {
    width: 100%;
    height: 60px;
  }
`;
