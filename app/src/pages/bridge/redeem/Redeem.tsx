import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { UIElementProps } from 'components/layouts/UIElementProps';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import React, { useEffect } from 'react';
import { truncateEvm } from '@libs/formatter';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { GuardSpinner } from 'react-spinners-kit';
import { useWormholeSignedVAA } from './useWormholeSignedVAA';
import { HorizontalDashedRuler } from '@libs/neumorphism-ui/components/HorizontalDashedRuler';
import { importCoreWasm } from '@certusone/wormhole-sdk/lib/cjs/solana/wasm';
//import { useWormholeParseVAA } from './useWormholeParseVAA';

interface RedemptionSummaryListProps {
  sequence: string;
}

const RedemptionSummaryList = (props: RedemptionSummaryListProps) => {
  const { sequence } = props;
  return (
    <TxFeeList className="receipt">
      <TxFeeListItem label="Sequence">{sequence}</TxFeeListItem>
      <TxFeeListItem label="Timestamp">9th Feb 2022 9:30am</TxFeeListItem>
      <TxFeeListItem label="Target Address">
        {truncateEvm('0x29c46471b286A3769f786ee089fDDE63Bdb2480C')}
      </TxFeeListItem>
      <TxFeeListItem label="Amount">250 UST</TxFeeListItem>
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

  const { sequence } = useParams<URLParams>();

  //const parseVAA = useWormholeParseVAA();

  const { loading, vaaBytes } = useWormholeSignedVAA(1, '365');

  useEffect(() => {
    if (vaaBytes) {
      (async () => {
        console.log('loading', vaaBytes);
        const { parse_vaa } = await importCoreWasm();
        console.log(parse_vaa);
        const payload = parse_vaa(vaaBytes);
        console.log(payload);
      })();
    }
    return undefined;
  }, [vaaBytes]);

  // const payload = useMemo(() => {
  //   if (parseVAA && wormhole.vaaBytes) {
  //     console.log('has parser');
  //     const parsedVAA = parseVAA(wormhole.vaaBytes);
  //     // const payload = parseTransferPayload(
  //     //   Buffer.from(new Uint8Array(parsedVAA.payload)),
  //     // );
  //     // console.log(payload);
  //   }
  // },
  // [wormhole.vaaBytes, parseVAA]);

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
        {loading ? <Loading /> : <RedemptionSummaryList sequence={sequence!} />}
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
