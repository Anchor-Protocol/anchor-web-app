import {
  Airdrop as AirdropData,
  validateTxFee,
} from '@anchor-protocol/app-fns';
import {
  useAirdropCheckQuery,
  useAirdropClaimTx,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import {
  formatANCWithPostfixUnits,
  formatUST,
} from '@anchor-protocol/notation';
import { useGasPrice } from '@libs/app-provider';
import { demicrofy } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { StreamStatus } from '@rx-stream/react';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import React, { useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SwishSpinner } from 'react-spinners-kit';
import styled from 'styled-components';

export interface AirdropProps {
  className?: string;
}

// FIXME remove hard coding (moved to src/webapp-fns/env.ts)
//const airdropTxFee: u<UST<number>> = 127000 as u<UST<number>>;

function AirdropBase({ className }: AirdropProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { availablePost, connected } = useAccount();

  const navigate = useNavigate();

  const { data: airdrop, isLoading } = useAirdropCheckQuery();

  const [claim, claimResult] = useAirdropClaimTx();

  const { constants } = useAnchorWebapp();

  const airdropFee = useGasPrice(constants.airdropGas, 'uusd');

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useAnchorBank();

  const invalidTxFee = useMemo(
    () => connected && validateTxFee(bank.tokenBalances.uUST, airdropFee),
    [airdropFee, bank, connected],
  );

  const exit = useCallback(() => {
    navigate('/earn');
  }, [navigate]);

  const proceed = useCallback(
    (airdrop: AirdropData) => {
      if (!connected || !claim) {
        return;
      }

      claim({ airdrop });
    },
    [claim, connected],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    claimResult?.status === StreamStatus.IN_PROGRESS ||
    claimResult?.status === StreamStatus.DONE
  ) {
    return (
      <CenteredLayout className={className} maxWidth={800}>
        <Section>
          <TxResultRenderer resultRendering={claimResult.value} onExit={exit} />
        </Section>
      </CenteredLayout>
    );
  }

  // in-progress api check if there is an airdrop
  if (isLoading) {
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
            {formatUST(demicrofy(airdropFee))} UST
          </TxFeeListItem>
        </TxFeeList>

        <ViewAddressWarning>
          <ActionButton
            className="proceed"
            disabled={
              !connected ||
              !availablePost ||
              !claim ||
              !airdrop ||
              !!invalidTxFee
            }
            onClick={() => airdrop && proceed(airdrop)}
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
