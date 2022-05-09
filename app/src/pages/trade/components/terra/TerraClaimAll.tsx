import { validateTxFee } from '@anchor-protocol/app-fns';
import {
  useRewardsAncGovernanceRewardsQuery,
  useRewardsAncUstLpRewardsQuery,
  useRewardsClaimableUstBorrowRewardsQuery,
} from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import { formatUST } from '@anchor-protocol/notation';
import { ANC, u } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
import { demicrofy, formatUToken } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Section } from '@libs/neumorphism-ui/components/Section';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { MINIMUM_CLAIM_BALANCE } from 'pages/trade/env';
import { useCheckTerraswapLpRewards } from 'queries/checkTerraswapLpBalance';
import React, { useCallback } from 'react';
import { useClaimRewardsTx } from 'tx/terra';
import { ClaimAll } from '../ClaimAll';

export const TerraClaimAll = () => {
  const { availablePost, connected } = useAccount();

  const fixedFee = useFixedFee();

  const [claim, claimResult] = useClaimRewardsTx();

  const bank = useAnchorBank();

  const { data: { borrowerInfo } = {}, isFetched: borrowerInfoIsFetched } =
    useRewardsClaimableUstBorrowRewardsQuery();

  const {
    data: { userLPPendingToken } = {},
    isFetched: userLPPendingTokenIsFetched,
  } = useRewardsAncUstLpRewardsQuery();

  const {
    data: { userGovStakingInfo } = {},
    isFetched: userGovStakingInfoIsFetched,
  } = useRewardsAncGovernanceRewardsQuery();

  const rewards = useCheckTerraswapLpRewards();

  const ancRewards = big(borrowerInfo?.pending_rewards ?? 0)
    .plus(userLPPendingToken?.pending_on_proxy ?? 0)
    .plus(userGovStakingInfo?.pending_voting_rewards ?? 0);

  const invalidTxFee =
    connected && validateTxFee(bank.tokenBalances.uUST, fixedFee);

  const proceed = useCallback(() => {
    if (!connected || !claim) {
      return;
    }
    claim({ includeLp: true });
  }, [claim, connected]);

  const astroRewards = userLPPendingToken?.pending;

  const hasAstroRewards = astroRewards && big(astroRewards).gt(0);
  const hasAncRewards = ancRewards && ancRewards.gt(0);
  const hasRewards = hasAstroRewards || hasAncRewards;

  return (
    <ClaimAll txResult={claimResult}>
      {rewards && (
        <MessageBox level="info">
          To claim rewards earned on the previous LP staking contract,{' '}
          <a
            href="https://terraswap-app.anchorprotocol.com/claim/anc-ust-lp"
            target="_blank"
            rel="noreferrer"
          >
            click here
          </a>
          <br />
          <br />
          <a
            href="https://terraswap-app.anchorprotocol.com/claim/anc-ust-lp"
            target="_blank"
            rel="noreferrer"
          >
            Your ANC-UST LP Rewards: {formatUToken(rewards.lpRewards)} ANC
          </a>
        </MessageBox>
      )}

      <Section>
        <h1>Claim All Rewards</h1>

        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        <TxFeeList className="receipt">
          {hasAstroRewards && (
            <TxFeeListItem label="ASTRO">
              {formatUToken(astroRewards)} ASTRO
            </TxFeeListItem>
          )}
          {hasAncRewards && (
            <TxFeeListItem label="ANC">
              {formatUToken(ancRewards as u<ANC<Big>>)} ANC
            </TxFeeListItem>
          )}
          <TxFeeListItem label="Tx Fee">
            {formatUST(demicrofy(fixedFee))} UST
          </TxFeeListItem>
        </TxFeeList>

        <ViewAddressWarning>
          <ActionButton
            className="button d"
            disabled={
              !availablePost ||
              !connected ||
              !claim ||
              !userLPPendingTokenIsFetched ||
              !userGovStakingInfoIsFetched ||
              !borrowerInfoIsFetched ||
              !hasRewards ||
              ancRewards.lt(MINIMUM_CLAIM_BALANCE)
            }
            onClick={() => proceed()}
          >
            Claim
          </ActionButton>
        </ViewAddressWarning>
      </Section>
    </ClaimAll>
  );
};
