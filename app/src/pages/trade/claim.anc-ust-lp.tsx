import { validateTxFee } from '@anchor-protocol/app-fns';
import {
  useRewardsAncUstLpClaimTx,
  useRewardsAncUstLpRewardsQuery,
} from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import { formatUST } from '@anchor-protocol/notation';
import { ANC, u } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
import { demicrofy, formatUToken } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { StreamStatus } from '@rx-stream/react';
import big, { Big } from 'big.js';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { MessageBox } from 'components/MessageBox';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export interface ClaimAncUstLpProps {
  className?: string;
}

function ClaimAncUstLpBase({ className }: ClaimAncUstLpProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { availablePost, connected } = useAccount();

  const fixedFee = useFixedFee();

  const [claim, claimResult] = useRewardsAncUstLpClaimTx();

  const navigate = useNavigate();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useAnchorBank();

  const { data: { userLPPendingToken } = {} } =
    useRewardsAncUstLpRewardsQuery();

  //const rewards = useCheckTerraswapLpRewards();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const ancRewards = useMemo(() => {
    if (!userLPPendingToken) return undefined;
    return big(userLPPendingToken.pending_on_proxy) as u<ANC<Big>>;
  }, [userLPPendingToken]);

  const invalidTxFee = useMemo(
    () => connected && validateTxFee(bank.tokenBalances.uUST, fixedFee),
    [bank, fixedFee, connected],
  );

  const proceed = useCallback(() => {
    if (!connected || !claim) {
      return;
    }

    claim({});
  }, [claim, connected]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    claimResult?.status === StreamStatus.IN_PROGRESS ||
    claimResult?.status === StreamStatus.DONE
  ) {
    const onExit =
      claimResult.status === StreamStatus.DONE
        ? () => navigate('/mypage')
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

  const astroRewards = userLPPendingToken?.pending;

  const hasAstroRewards = astroRewards && !big(astroRewards).eq(0);
  const hasAncRewards = ancRewards && !ancRewards.eq(0);
  const hasRewards = hasAstroRewards || hasAncRewards;

  return (
    <CenteredLayout className={className} maxWidth={800}>
      <Section>
        <h1>ANC-UST LP Claim</h1>

        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        <TxFeeList className="receipt">
          {hasAstroRewards && (
            <TxFeeListItem label="ASTRO">
              {formatUToken(astroRewards)} ASTRO
            </TxFeeListItem>
          )}
          {hasAncRewards && (
            <TxFeeListItem label="ANC">
              {formatUToken(ancRewards)} ANC
            </TxFeeListItem>
          )}
          <TxFeeListItem label="Tx Fee">
            {formatUST(demicrofy(fixedFee))} UST
          </TxFeeListItem>
        </TxFeeList>

        <ViewAddressWarning>
          <ActionButton
            className="proceed"
            disabled={!availablePost || !connected || !claim || !hasRewards}
            onClick={() => proceed()}
          >
            Claim
          </ActionButton>
        </ViewAddressWarning>
      </Section>
    </CenteredLayout>
  );
}

export const ClaimAncUstLp = styled(ClaimAncUstLpBase)`
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
