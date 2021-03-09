import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatUST,
} from '@anchor-protocol/notation';
import { uANC } from '@anchor-protocol/types';
import { WalletReady } from '@anchor-protocol/wallet-provider';
import big, { Big } from 'big.js';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { useBank } from 'contexts/bank';
import { useConstants } from 'contexts/contants';
import { useService } from 'contexts/service';
import { validateTxFee } from 'logics/validateTxFee';
import { MINIMUM_CLAIM_BALANCE } from 'pages/gov/env';
import { useClaimableAncUstLp } from 'pages/gov/queries/claimableAncUstLp';
import { useClaimableUstBorrow } from 'pages/gov/queries/claimableUstBorrow';
import { allClaimOptions } from 'pages/gov/transactions/allClaimOptions';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

export interface ClaimAllProps {
  className?: string;
}

function ClaimAllBase({ className }: ClaimAllProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const [claim, claimResult] = useOperation(allClaimOptions, {});

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const {
    data: { borrowerInfo, userANCBalance },
  } = useClaimableUstBorrow();

  const {
    data: { userLPStakingInfo },
  } = useClaimableAncUstLp();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const claimingBorrowerInfoPendingRewards = useMemo(() => {
    if (!borrowerInfo) return undefined;
    return big(borrowerInfo.pending_rewards) as uANC<Big>;
  }, [borrowerInfo]);

  const claimingLpStaingInfoPendingRewards = useMemo(() => {
    if (!userLPStakingInfo) return undefined;
    return big(userLPStakingInfo.pending_reward) as uANC<Big>;
  }, [userLPStakingInfo]);

  const claiming = useMemo(() => {
    if (
      !claimingBorrowerInfoPendingRewards ||
      !claimingLpStaingInfoPendingRewards
    ) {
      return undefined;
    }

    console.log(
      'claim.all.tsx..()',
      claimingBorrowerInfoPendingRewards.toFixed(),
      claimingLpStaingInfoPendingRewards.toFixed(),
    );

    return claimingLpStaingInfoPendingRewards.plus(
      claimingBorrowerInfoPendingRewards,
    ) as uANC<Big>;
  }, [claimingBorrowerInfoPendingRewards, claimingLpStaingInfoPendingRewards]);

  const ancAfterTx = useMemo(() => {
    if (!claiming || !userANCBalance) return undefined;
    return claiming.plus(userANCBalance.balance) as uANC<Big>;
  }, [claiming, userANCBalance]);

  const invalidTxFee = useMemo(() => validateTxFee(bank, fixedGas), [
    bank,
    fixedGas,
  ]);

  const proceed = useCallback(
    async (
      walletReady: WalletReady,
      claimMoneyMarketRewards: boolean,
      cliamLpStakingRewards: boolean,
    ) => {
      await claim({
        walletAddress: walletReady.walletAddress,
        cliamLpStakingRewards,
        claimMoneyMarketRewards,
      });
    },
    [claim],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    claimResult?.status === 'in-progress' ||
    claimResult?.status === 'done' ||
    claimResult?.status === 'fault'
  ) {
    return (
      <CenteredLayout className={className} maxWidth={800}>
        <Section>
          <TransactionRenderer result={claimResult} />
        </Section>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout className={className} maxWidth={800}>
      <Section>
        <h1>Claim All Rewards</h1>

        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        <TxFeeList className="receipt">
          <TxFeeListItem label="Claiming">
            {claiming ? formatANCWithPostfixUnits(demicrofy(claiming)) : 0} ANC
          </TxFeeListItem>
          <TxFeeListItem label="ANC After Tx">
            {ancAfterTx ? formatANCWithPostfixUnits(demicrofy(ancAfterTx)) : 0}{' '}
            ANC
          </TxFeeListItem>
          <TxFeeListItem label="Tx Fee">
            {formatUST(demicrofy(fixedGas))} UST
          </TxFeeListItem>
        </TxFeeList>

        <ActionButton
          className="proceed"
          disabled={
            !serviceAvailable ||
            !claimingLpStaingInfoPendingRewards ||
            !claimingBorrowerInfoPendingRewards ||
            !claiming ||
            (claimingBorrowerInfoPendingRewards.lt(MINIMUM_CLAIM_BALANCE) &&
              claimingLpStaingInfoPendingRewards.lt(MINIMUM_CLAIM_BALANCE))
          }
          onClick={() =>
            walletReady &&
            claimingBorrowerInfoPendingRewards &&
            claimingLpStaingInfoPendingRewards &&
            proceed(
              walletReady,
              claimingBorrowerInfoPendingRewards.gte(MINIMUM_CLAIM_BALANCE),
              claimingLpStaingInfoPendingRewards.gte(MINIMUM_CLAIM_BALANCE),
            )
          }
        >
          Claim
        </ActionButton>
      </Section>
    </CenteredLayout>
  );
}

export const ClaimAll = styled(ClaimAllBase)`
  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    margin-bottom: 50px;
  }

  .receipt {
    margin-top: 30px;
  }

  .proceed {
    margin-top: 40px;

    width: 100%;
    height: 60px;
  }
`;
