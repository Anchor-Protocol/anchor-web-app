import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatUST,
} from '@anchor-protocol/notation';
import {
  useConnectedWallet,
  WalletReady,
} from '@anchor-protocol/wallet-provider';
import { useOperation } from '@terra-dev/broadcastable-operation';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { useBank } from 'base/contexts/bank';
import { useConstants } from 'base/contexts/contants';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { validateTxFee } from 'logics/validateTxFee';
import {
  Airdrop as AirdropData,
  useAirdrop,
} from 'pages/airdrop/queries/useAirdrop';
import { airdropClaimOptions } from 'pages/airdrop/transactions/airdropClaimOptions';
import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SwishSpinner } from 'react-spinners-kit';
import styled from 'styled-components';

export interface AirdropProps {
  className?: string;
}

function AirdropBase({ className }: AirdropProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { fixedGas } = useConstants();

  const [airdrop, refetch] = useAirdrop();

  const [claim, claimResult] = useOperation(airdropClaimOptions, {});

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const invalidTxFee = useMemo(
    () => connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const init = useCallback(() => {
    refetch();
  }, [refetch]);

  const proceed = useCallback(
    async (walletReady: WalletReady, airdrop: AirdropData) => {
      const broadcasted = await claim({
        address: walletReady.walletAddress,
        airdrop,
      });

      if (!broadcasted) {
        init();
      }
    },
    [claim, init],
  );

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
          <TransactionRenderer result={claimResult} onExit={init} />
        </Section>
      </CenteredLayout>
    );
  }

  if (airdrop === 'in-progress') {
    return (
      <CenteredLayout className={className} maxWidth={800}>
        <Section>
          <EmptyMessage>
            <SwishSpinner />
          </EmptyMessage>
          <ActionButton className="proceed" component={Link} to={`/earn`}>
            Exit
          </ActionButton>
        </Section>
      </CenteredLayout>
    );
  }

  if (!airdrop) {
    return (
      <CenteredLayout className={className} maxWidth={800}>
        <Section>
          <EmptyMessage>No Airdrop</EmptyMessage>
          <ActionButton className="proceed" component={Link} to={`/earn`}>
            Exit
          </ActionButton>
        </Section>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout className={className} maxWidth={800}>
      <Section>
        <h1>Airdrop</h1>

        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        <Amount>
          <span>Amount</span>
          <span>
            {formatANCWithPostfixUnits(demicrofy(airdrop.amount))} ANC
          </span>
        </Amount>

        <TxFeeList className="receipt">
          <TxFeeListItem label="Tx Fee">
            {formatUST(demicrofy(fixedGas))} UST
          </TxFeeListItem>
        </TxFeeList>

        <ActionButton
          className="proceed"
          disabled={!connectedWallet || !airdrop}
          onClick={() =>
            connectedWallet && airdrop && proceed(connectedWallet, airdrop)
          }
        >
          Claim
        </ActionButton>
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

export const EmptyMessage = styled.div`
  height: 200px;
  display: grid;
  place-content: center;
`;

export const Airdrop = styled(AirdropBase)`
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
