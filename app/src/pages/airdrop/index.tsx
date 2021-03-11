import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatUST,
} from '@anchor-protocol/notation';
import { WalletReady } from '@anchor-protocol/wallet-provider';
import { useBank } from '@anchor-protocol/web-contexts/contexts/bank';
import { useConstants } from '@anchor-protocol/web-contexts/contexts/contants';
import { useService } from '@anchor-protocol/web-contexts/contexts/service';
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
import styled from 'styled-components';

export interface AirdropProps {
  className?: string;
}

function AirdropBase({ className }: AirdropProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const [airdrop, refetch] = useAirdrop();

  const [claim, claimResult] = useOperation(airdropClaimOptions, {});

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const invalidTxFee = useMemo(() => validateTxFee(bank, fixedGas), [
    bank,
    fixedGas,
  ]);

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
          disabled={!serviceAvailable || !airdrop}
          onClick={() =>
            walletReady && airdrop && proceed(walletReady, airdrop)
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
