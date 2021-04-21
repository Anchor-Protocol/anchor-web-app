import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatUST,
} from '@anchor-protocol/notation';
import { uANC } from '@anchor-protocol/types';
import {
  useConnectedWallet,
  ConnectedWallet,
} from '@anchor-protocol/wallet-provider';
import { useOperation } from '@terra-dev/broadcastable-operation';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { useBank } from 'base/contexts/bank';
import { useConstants } from 'base/contexts/contants';
import big, { Big } from 'big.js';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { validateTxFee } from 'logics/validateTxFee';
import { MINIMUM_CLAIM_BALANCE } from 'pages/gov/env';
import { useClaimableAncUstLp } from 'pages/gov/queries/claimableAncUstLp';
import { useClaimableUstBorrow } from 'pages/gov/queries/claimableUstBorrow';
import { ancUstLpClaimOptions } from 'pages/gov/transactions/ancUstLpClaimOptions';
import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

export interface ClaimAncUstLpProps {
  className?: string;
}

function ClaimAncUstLpBase({ className }: ClaimAncUstLpProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { fixedGas } = useConstants();

  const [claim, claimResult] = useOperation(ancUstLpClaimOptions, {});

  const history = useHistory();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const {
    data: { userANCBalance },
  } = useClaimableUstBorrow();

  const {
    data: { userLPStakingInfo },
  } = useClaimableAncUstLp();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const claiming = useMemo(() => {
    if (!userLPStakingInfo) return undefined;
    return big(userLPStakingInfo.pending_reward) as uANC<Big>;
  }, [userLPStakingInfo]);

  const ancAfterTx = useMemo(() => {
    if (!claiming || !userANCBalance) return undefined;
    return claiming.plus(userANCBalance.balance) as uANC<Big>;
  }, [claiming, userANCBalance]);

  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const proceed = useCallback(
    async (walletReady: ConnectedWallet) => {
      await claim({
        address: walletReady.walletAddress,
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
    const onExit =
      claimResult.status === 'done' ? () => history.push('/gov') : undefined;

    return (
      <CenteredLayout className={className} maxWidth={800}>
        <Section>
          <TransactionRenderer result={claimResult} onExit={onExit} />
        </Section>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout className={className} maxWidth={800}>
      <Section>
        <h1>ANC-UST LP Claim</h1>

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
            !connectedWallet ||
            !connectedWallet.availablePost ||
            !claiming ||
            claiming.lte(MINIMUM_CLAIM_BALANCE)
          }
          onClick={() => connectedWallet && proceed(connectedWallet)}
        >
          Claim
        </ActionButton>
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
