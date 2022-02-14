import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { UIElementProps } from 'components/layouts/UIElementProps';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import React, { useState, useEffect } from 'react';
import { truncateEvm } from '@libs/formatter';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { GuardSpinner } from 'react-spinners-kit';
import { HorizontalDashedRuler } from '@libs/neumorphism-ui/components/HorizontalDashedRuler';
import {
  hexToNativeString,
  parseTransferPayload,
} from '@certusone/wormhole-sdk';
import {
  useWormholeSignedVAA,
  useWormholeAsset,
  parseVAA,
} from '@anchor-protocol/wormhole';

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

interface URLParams {
  chainId?: string;
  sequence?: string;
}

function RedeemBase(props: UIElementProps) {
  const { className } = props;

  const { chainId = '', sequence = '' } = useParams<URLParams>();

  const { loading, vaaBytes } = useWormholeSignedVAA(chainId, sequence);

  const [payload, setPayload] = useState<WormholePayloadType | undefined>();

  useEffect(() => {
    let value: WormholePayloadType | undefined = undefined;
    if (vaaBytes) {
      const vaa = parseVAA(vaaBytes);
      value = {
        timestamp: vaa.timestamp,
        ...parseTransferPayload(vaa.payload),
      };
    }
    setPayload(value);
  }, [vaaBytes]);

  // if (
  //   txResult?.status === StreamStatus.IN_PROGRESS ||
  //   txResult?.status === StreamStatus.DONE
  // ) {
  //   const onExit =
  //     txResult.status === StreamStatus.DONE
  //       ? () => history.push('/mypage')
  //       : () => {};

  //   return (
  //     <CenteredLayout className={className} maxWidth={800}>
  //       <Section>
  //         <TxResultRenderer
  //           resultRendering={txResult.value}
  //           onExit={onExit}
  //         />
  //       </Section>
  //     </CenteredLayout>
  //   );
  // }

  return (
    <CenteredLayout className={className} maxWidth={800}>
      <Section>
        <h1>Redeem</h1>
        <p className="text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio
          arcu, porttitor sed mollis at, pulvinar at lectus. Nam semper dui at
          quam sollicitudin, sit amet lacinia ligula eleifend.
        </p>
        {loading || !payload ? (
          <Loading />
        ) : (
          <RedemptionSummaryList sequence={sequence!} payload={payload} />
        )}
        <ViewAddressWarning>
          <ActionButton
            className="submit"
            disabled={loading}
            onClick={() => {
              console.log('Redeeming');
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
  .loading {
    margin: 30px 0 40px 0;
  }

  .loading {
    display: flex;
    flex-direction: column;
    .spinner {
      margin: 15px auto;
    }
  }

  .submit {
    width: 100%;
    height: 60px;
  }
`;
