import { validateTxFee } from '@anchor-protocol/app-fns';
import { useAnchorBank, useBAssetClaimTx } from '@anchor-protocol/app-provider';
import { formatUST } from '@anchor-protocol/notation';
import { useFixedFee } from '@libs/app-provider';
import { demicrofy } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { u, UST } from '@libs/types';
import { StreamStatus } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { Big } from 'big.js';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { MessageBox } from 'components/MessageBox';
import { Sub } from 'components/Sub';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useClaimableRewardsBreakdown } from './hooks/useRewardsBreakdown';

export interface BAssetClaimProps {
  className?: string;
}

function Component({ className }: BAssetClaimProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();
  const navigate = useNavigate();

  const fixedFee = useFixedFee();

  const [claim, claimResult] = useBAssetClaimTx();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { tokenBalances } = useAnchorBank();

  const { totalRewardsUST, rewardBreakdowns } = useClaimableRewardsBreakdown();

  //const {} = useAnchorWebapp()

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(tokenBalances.uUST, fixedFee),
    [connectedWallet, tokenBalances.uUST, fixedFee],
  );

  const estimatedAmount = useMemo(() => {
    const amount = totalRewardsUST.minus(fixedFee) as u<UST<Big>>;
    return amount.gt(fixedFee) ? amount : undefined;
  }, [totalRewardsUST, fixedFee]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const proceed = useCallback(() => {
    if (!connectedWallet || !claim || !totalRewardsUST) {
      return;
    }

    if (rewardBreakdowns.length === 0) {
      throw new Error('There is no rewards');
    }

    claim({
      rewardBreakdowns,
    });
  }, [claim, totalRewardsUST, connectedWallet, rewardBreakdowns]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    claimResult?.status === StreamStatus.IN_PROGRESS ||
    claimResult?.status === StreamStatus.DONE
  ) {
    return (
      <CenteredLayout className={className} maxWidth={720}>
        <Section>
          <TxResultRenderer
            resultRendering={claimResult.value}
            onExit={() => {
              switch (claimResult.status) {
                case StreamStatus.IN_PROGRESS:
                  claimResult.abort();
                  break;
                case StreamStatus.DONE:
                  claimResult.clear();
                  navigate('/basset');
                  break;
              }
            }}
          />
        </Section>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout className={className} maxWidth={720}>
      <Section>
        <h1>Claim Rewards</h1>

        {!!invalidTxFee && totalRewardsUST.gt(0) && (
          <MessageBox>{invalidTxFee}</MessageBox>
        )}

        <div className="amount">
          {formatUST(demicrofy(totalRewardsUST))} <Sub>UST</Sub>
        </div>

        <TxFeeList className="receipt">
          {estimatedAmount && (
            <TxFeeListItem label="Estimated Amount">
              {formatUST(demicrofy(estimatedAmount))} UST
            </TxFeeListItem>
          )}
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
              !estimatedAmount ||
              !!invalidTxFee
            }
            onClick={proceed}
          >
            Claim
          </ActionButton>
        </ViewAddressWarning>
      </Section>
    </CenteredLayout>
  );
}

export const Amount = styled.div`
  display: flex;
  justify-content: space-between;

  font-size: 18px;
  font-weight: 500;
`;

const StyledComponent = styled(Component)`
  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    margin-bottom: 50px;
  }

  .amount {
    font-size: 32px;
    font-weight: normal;
    text-align: center;

    sub {
      font-size: 18px;
      font-weight: 500;
    }
  }

  .receipt {
    margin-top: 60px;
  }

  .proceed {
    margin-top: 40px;

    width: 100%;
    height: 60px;
  }
`;

export const BAssetClaim = fixHMR(StyledComponent);
