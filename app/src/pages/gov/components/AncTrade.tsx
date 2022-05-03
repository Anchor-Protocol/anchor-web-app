import { UST } from '@anchor-protocol/types';
import { AnimateNumber, UIElementProps } from '@libs/ui';
import React from 'react';
import styled from 'styled-components';
import { Circles } from 'components/primitives/Circles';
import { anc160gif, GifIcon } from '@anchor-protocol/token-icons';
import { useDeploymentTarget } from '@anchor-protocol/app-provider';
import { useNavigate } from 'react-router-dom';
import { useAssetPriceInUstQuery } from 'queries';
import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { Sub } from 'components/Sub';
import { TitledCard } from '@libs/ui/cards/TitledCard';
import { HStack } from '@libs/ui/Stack';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';

const AncTradeBase = (props: UIElementProps) => {
  const { className } = props;

  const { data: ancPrice } = useAssetPriceInUstQuery('anc');

  const navigate = useNavigate();

  const {
    target: { isNative },
  } = useDeploymentTarget();

  const onClick = isNative ? () => navigate(`/trade/buy`) : undefined;

  return (
    <TitledCard
      title={
        <HStack alignItems="center" gap={24}>
          <Circles className="icon" backgroundColors={['#2C2C2C']} radius={24}>
            <GifIcon
              src={anc160gif}
              style={{ fontSize: '2em', borderRadius: '50%' }}
            />
          </Circles>
          <p>Trade ANC</p>
        </HStack>
      }
    >
      <div className={className}>
        <div className="price">
          <AnimateNumber format={formatUSTWithPostfixUnits}>
            {ancPrice || ('0' as UST)}
          </AnimateNumber>{' '}
          <Sub>UST</Sub>
        </div>
      </div>
      <BorderButton onClick={onClick}>Trade ANC</BorderButton>
    </TitledCard>
  );
};

export const AncTrade = styled(AncTradeBase)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  .heading {
    text-align: center;
    margin: 10px 0;
  }

  .price {
    text-align: center;
  }
`;
