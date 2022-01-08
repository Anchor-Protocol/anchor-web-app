import { validateTxFee } from '@anchor-protocol/app-fns';
import {
  useRewardsAllClaimTx,
  useRewardsAncUstLpRewardsQuery,
  useRewardsClaimableUstBorrowRewardsQuery,
} from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import {
  formatANCWithPostfixUnits,
  formatUST,
} from '@anchor-protocol/notation';
import { ANC, u } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
import { demicrofy, formatUToken } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { StreamStatus } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { Big } from 'big.js';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { MessageBox } from 'components/MessageBox';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { MINIMUM_CLAIM_BALANCE } from 'pages/trade/env';
import { useCheckTerraswapLpRewards } from 'queries/checkTerraswapLpBalance';
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

  const { data: { userLPPendingToken } = {} } =
    useRewardsAncUstLpRewardsQuery();

  const rewards = useCheckTerraswapLpRewards();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const claimingBorrowerInfoPendingRewards = useMemo(() => {
    if (!borrowerInfo) return undefined;
    return big(borrowerInfo.pending_rewards) as u<ANC<Big>>;
  }, [borrowerInfo]);

  const claimingLpStakingInfoPendingRewards = useMemo(() => {
    if (!userLPPendingToken) return undefined;
    return big(userLPPendingToken.pending_on_proxy) as u<ANC<Big>>;
  }, [userLPPendingToken]);

  const claiming = useMemo(() => {
    if (
      !claimingBorrowerInfoPendingRewards ||
      !claimingLpStakingInfoPendingRewards
    ) {
      return undefined;
    }

    return claimingLpStakingInfoPendingRewards.plus(
      claimingBorrowerInfoPendingRewards,
    ) as u<ANC<Big>>;
  }, [claimingBorrowerInfoPendingRewards, claimingLpStakingInfoPendingRewards]);

  const ancAfterTx = useMemo(() => {
    if (!claiming || !userANCBalance) return undefined;
    return claiming.plus(userANCBalance.balance) as u<ANC<Big>>;
  }, [claiming, userANCBalance]);

  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank.tokenBalances.uUST, fixedFee),
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
          <TxFeeListItem label="Claiming">
            {claiming ? formatANCWithPostfixUnits(demicrofy(claiming)) : 0} ANC
            {' + '}
            {userLPPendingToken
              ? formatUToken(userLPPendingToken.pending)
              : 0}{' '}
            ASTRO
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
              !claimingLpStakingInfoPendingRewards ||
              !claimingBorrowerInfoPendingRewards ||
              !claiming ||
              (claimingBorrowerInfoPendingRewards.lt(MINIMUM_CLAIM_BALANCE) &&
                claimingLpStakingInfoPendingRewards.lt(MINIMUM_CLAIM_BALANCE))
            }
            onClick={() =>
              claimingBorrowerInfoPendingRewards &&
              claimingLpStakingInfoPendingRewards &&
              proceed(
                claimingBorrowerInfoPendingRewards.gte(MINIMUM_CLAIM_BALANCE),
                claimingLpStakingInfoPendingRewards.gte(MINIMUM_CLAIM_BALANCE),
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
