import {
  formatANCWithPostfixUnits,
  formatUST,
} from '@anchor-protocol/notation';
import { ANC, u } from '@anchor-protocol/types';
import {
  useRewardsAllClaimTx,
  useRewardsClaimableAncUstLpRewardsQuery,
  useRewardsClaimableUstBorrowRewardsQuery,
} from '@anchor-protocol/webapp-provider';
import { useAnchorBank } from '@anchor-protocol/webapp-provider/hooks/useAnchorBank';
import { useFixedFee } from '@libs/app-provider';
import { demicrofy } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { StreamStatus } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { Big } from 'big.js';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { validateTxFee } from 'logics/validateTxFee';
import { MINIMUM_CLAIM_BALANCE } from 'pages/trade/env';
import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

export interface ClaimAllProps {
  className?: string;
}

function ClaimAllBase({ className }: ClaimAllProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const fixedFee = useFixedFee();

  const [claim, claimResult] = useRewardsAllClaimTx();

  const history = useHistory();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useAnchorBank();

  const { data: { borrowerInfo, userANCBalance } = {} } =
    useRewardsClaimableUstBorrowRewardsQuery();

  const { data: { lPStakerInfo: userLPStakingInfo } = {} } =
    useRewardsClaimableAncUstLpRewardsQuery();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const claimingBorrowerInfoPendingRewards = useMemo(() => {
    if (!borrowerInfo) return undefined;
    return big(borrowerInfo.pending_rewards) as u<ANC<Big>>;
  }, [borrowerInfo]);

  const claimingLpStaingInfoPendingRewards = useMemo(() => {
    if (!userLPStakingInfo) return undefined;
    return big(userLPStakingInfo.pending_reward) as u<ANC<Big>>;
  }, [userLPStakingInfo]);

  const claiming = useMemo(() => {
    if (
      !claimingBorrowerInfoPendingRewards ||
      !claimingLpStaingInfoPendingRewards
    ) {
      return undefined;
    }

    return claimingLpStaingInfoPendingRewards.plus(
      claimingBorrowerInfoPendingRewards,
    ) as u<ANC<Big>>;
  }, [claimingBorrowerInfoPendingRewards, claimingLpStaingInfoPendingRewards]);

  const ancAfterTx = useMemo(() => {
    if (!claiming || !userANCBalance) return undefined;
    return claiming.plus(userANCBalance.balance) as u<ANC<Big>>;
  }, [claiming, userANCBalance]);

  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedFee),
    [bank, fixedFee, connectedWallet],
  );

  const proceed = useCallback(
    (claimMoneyMarketRewards: boolean, cliamLpStakingRewards: boolean) => {
      if (!connectedWallet || !claim) {
        return;
      }

      claim({
        claimAncUstLp: cliamLpStakingRewards,
        claimUstBorrow: claimMoneyMarketRewards,
      });
    },
    [claim, connectedWallet],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    claimResult?.status === StreamStatus.IN_PROGRESS ||
    claimResult?.status === StreamStatus.DONE
  ) {
    const onExit =
      claimResult.status === StreamStatus.DONE
        ? () => history.push('/mypage')
        : () => {};

    return (
      <CenteredLayout className={className} maxWidth={800}>
        <Section>
          <TxResultRenderer
            resultRendering={claimResult.value}
            onExit={onExit}
          />
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
            {formatUST(demicrofy(fixedFee))} UST
          </TxFeeListItem>
        </TxFeeList>

        <ViewAddressWarning>
          <ActionButton
            className="proceed"
            disabled={
              !connectedWallet ||
              !connectedWallet.availablePost ||
              !claim ||
              !claimingLpStaingInfoPendingRewards ||
              !claimingBorrowerInfoPendingRewards ||
              !claiming ||
              (claimingBorrowerInfoPendingRewards.lt(MINIMUM_CLAIM_BALANCE) &&
                claimingLpStaingInfoPendingRewards.lt(MINIMUM_CLAIM_BALANCE))
            }
            onClick={() =>
              claimingBorrowerInfoPendingRewards &&
              claimingLpStaingInfoPendingRewards &&
              proceed(
                claimingBorrowerInfoPendingRewards.gte(MINIMUM_CLAIM_BALANCE),
                claimingLpStaingInfoPendingRewards.gte(MINIMUM_CLAIM_BALANCE),
              )
            }
          >
            Claim
          </ActionButton>
        </ViewAddressWarning>
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
