import {
  formatANCWithPostfixUnits,
  formatUST,
} from '@anchor-protocol/notation';
import { ANC, u } from '@anchor-protocol/types';
import {
  useRewardsClaimableUstBorrowRewardsQuery,
  useRewardsUstBorrowClaimTx,
} from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
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
import { validateTxFee } from '@anchor-protocol/app-fns';
import { MINIMUM_CLAIM_BALANCE } from 'pages/trade/env';
import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

export interface ClaimUstBorrowProps {
  className?: string;
}

function ClaimUstBorrowBase({ className }: ClaimUstBorrowProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const fixedFee = useFixedFee();

  const [claim, claimResult] = useRewardsUstBorrowClaimTx();

  const history = useHistory();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useAnchorBank();

  const { data: { borrowerInfo, userANCBalance } = {} } =
    useRewardsClaimableUstBorrowRewardsQuery();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const claiming = useMemo(() => {
    if (!borrowerInfo) return undefined;
    return big(borrowerInfo.pending_rewards) as u<ANC<Big>>;
  }, [borrowerInfo]);

  const ancAfterTx = useMemo(() => {
    if (!claiming || !userANCBalance) return undefined;
    return claiming.plus(userANCBalance.balance) as u<ANC<Big>>;
  }, [claiming, userANCBalance]);

  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank.tokenBalances.uUST, fixedFee),
    [bank, fixedFee, connectedWallet],
  );

  const proceed = useCallback(() => {
    if (!connectedWallet || !claim) {
      return;
    }

    claim({});
  }, [claim, connectedWallet]);

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
        <h1>UST Borrow Claim</h1>

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
              !claiming ||
              claiming.lte(MINIMUM_CLAIM_BALANCE)
            }
            onClick={() => proceed()}
          >
            Claim
          </ActionButton>
        </ViewAddressWarning>
      </Section>
    </CenteredLayout>
  );
}

export const ClaimUstBorrow = styled(ClaimUstBorrowBase)`
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
