import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { SkeletonText } from '@anchor-protocol/neumorphism-ui/components/SkeletonText';
import useAnchorBalance from 'hooks/mantle/use-anchor-balance';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDepositDialog } from './useDepositDialog';

export interface TotalDepositSectionProps {
  className?: string;
}

function TotalDepositSectionBase({ className }: TotalDepositSectionProps) {
  const [loading, error, anchorBalance, refetch] = useAnchorBalance();

  console.log('TotalDepositSection.tsx..TotalDepositSectionBase()', { error });

  const [openDepositDialog, depositDialogElement] = useDepositDialog();

  const openDeposit = useCallback(async () => {
    await openDepositDialog({});
    refetch();
  }, [openDepositDialog, refetch]);

  const openWithdraw = useCallback(async () => {
    // await openWithdrawDialog({})
    refetch();
  }, [refetch]);

  return (
    <Section className={className}>
      {/*{error ? (*/}
      {/*  <SectionCover height={300}>{error.message}</SectionCover>*/}
      {/*) : (*/}
      {/*  <>*/}
      <h2>TOTAL DEPOSIT</h2>

      <div className="amount">
        {loading ? (
          <SkeletonText>0000.000000 UST</SkeletonText>
        ) : (
          <>
            2,320<span className="decimal-point">.063700</span> UST
          </>
        )}
      </div>

      <div className="amount-description">
        {loading ? (
          <SkeletonText>00000000 aUST</SkeletonText>
        ) : (
          <>{+anchorBalance!.balance / 1000000 || 0} aUST</>
        )}
      </div>

      <HorizontalRuler />

      <aside className="total-deposit-buttons">
        <ActionButton onClick={() => openDeposit()}>Deposit</ActionButton>
        <ActionButton onClick={() => openWithdraw()}>Withdraw</ActionButton>
      </aside>
      {/*  </>*/}
      {/*)}*/}
      {depositDialogElement}
    </Section>
  );
}

export const TotalDepositSection = styled(TotalDepositSectionBase)`
  // TODO
`;
