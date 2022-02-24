import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { UIElementProps } from 'components/layouts/UIElementProps';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import React from 'react';
import { truncateEvm } from '@libs/formatter';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { GuardSpinner } from 'react-spinners-kit';
import { HorizontalDashedRuler } from '@libs/neumorphism-ui/components/HorizontalDashedRuler';
import {
  hexToNativeString,
  parseTransferPayload,
} from '@certusone/wormhole-sdk';
import { useWormholeAsset } from '@anchor-protocol/wormhole';
import { StreamStatus } from '@rx-stream/react';
import { useAccount } from 'contexts/account';
import { Error } from './components/Error';
import { TxRendering } from './components/TxRenderer';
import { useRedeemTokensTx, useRedemptionPayload } from 'tx/evm';

type WormholePayloadType = ReturnType<typeof parseTransferPayload> & {
  timestamp: number;
};

const formatDate = (date: Date): string => {
  return `${date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })} ${date.toLocaleTimeString('en-US')}`;
};

interface RedemptionSummaryListProps {
  sequence: string;
  payload: WormholePayloadType;
}

const RedemptionSummaryList = (props: RedemptionSummaryListProps) => {
  const {
    sequence,
    payload: {
      timestamp,
      amount,
      originChain,
      originAddress,
      targetChain,
      targetAddress,
    },
  } = props;

  const { formatter } = useWormholeAsset(originAddress, originChain);

  return (
    <TxFeeList className="receipt">
      <TxFeeListItem label="Sequence">{sequence}</TxFeeListItem>
      <TxFeeListItem label="Timestamp">
        {formatDate(new Date(timestamp * 1000))}
      </TxFeeListItem>
      <TxFeeListItem label="Target Address">
        {truncateEvm(hexToNativeString(targetAddress, targetChain))}
      </TxFeeListItem>
      <TxFeeListItem label="Amount">{formatter(amount)}</TxFeeListItem>
    </TxFeeList>
  );
};

const Loading = () => {
  return (
    <figure className="loading">
      <HorizontalDashedRuler />
      <div className="spinner">
        <GuardSpinner />
      </div>
      <HorizontalDashedRuler />
    </figure>
  );
};

function RedeemBase(props: UIElementProps) {
  const { className } = props;

  const { sequence = '' } = useParams();

  const { connected } = useAccount();

  const { redemptionPayload, loading } = useRedemptionPayload(Number(sequence));
  const [redeemTokens, redeemTxResult] = useRedeemTokensTx(redemptionPayload);

  if (
    redeemTxResult?.status === StreamStatus.IN_PROGRESS ||
    redeemTxResult?.status === StreamStatus.DONE
  ) {
    return <TxRendering className={className} txResult={redeemTxResult} />;
  }

  if (!loading && !redemptionPayload) {
    return <Error className={className} sequence={sequence} />;
  }

  return (
    <CenteredLayout className={className} maxWidth={800}>
      <Section>
        <h1>Redeem</h1>
        <p className="text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio
          arcu, porttitor sed mollis at, pulvinar at lectus. Nam semper dui at
          quam sollicitudin, sit amet lacinia ligula eleifend.
        </p>
        {!redemptionPayload ? (
          <Loading />
        ) : (
          <RedemptionSummaryList
            sequence={sequence!}
            payload={redemptionPayload}
          />
        )}
        <ViewAddressWarning>
          <ActionButton
            className="submit"
            disabled={!connected || !redemptionPayload}
            onClick={() => {
              redeemTokens!({});
            }}
          >
            Redeem
          </ActionButton>
        </ViewAddressWarning>
      </Section>
    </CenteredLayout>
  );
}

export const Redeem = styled(RedeemBase)`
  h1 {
    text-align: center;
    font-size: 27px;
    font-weight: 500;

    margin-bottom: 60px;
  }

  .text {
    font-family: Gotham;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
  }

  .list {
    padding: 16px 32px;
    margin: 20px 0 0 0;
    background-color: ${({ theme }) => theme.hoverBackgroundColor};
    border-radius: 10px;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    text-align: left;
    li:nth-child(1) {
      margin-bottom: 8px;
    }
    li:nth-child(2) {
      margin-top: 8px;
    }
  }

  .receipt,
  .error,
  .loading {
    margin: 30px 0 40px 0;
  }

  .error,
  .loading {
    display: flex;
    flex-direction: column;
  }

  .error {
    h2 {
      font-weight: 500;
      font-size: 1.3em;
      text-align: center;
      margin-top: 1em;
      margin-bottom: 1.2em;
    }
    .icon {
      color: ${({ theme }) => theme.colors.negative};
      margin: 0 auto;
      width: 6em;
      height: 6em;
      border-radius: 50%;
      border: 3px solid currentColor;
      display: grid;
      place-content: center;
      svg {
        font-size: 3em;
      }
    }
    .text {
      text-align: center;
      margin-top: 20px;
    }
  }

  .loading {
    .spinner {
      margin: 15px auto;
    }
  }

  .submit {
    width: 100%;
    height: 60px;
  }
`;
