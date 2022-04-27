import { UST } from '@anchor-protocol/types';
import { AnimateNumber, UIElementProps } from '@libs/ui';
import React from 'react';
import styled from 'styled-components';
import { ButtonCard } from './ButtonCard';
import { Circles } from 'components/primitives/Circles';
import { anc160gif, GifIcon } from '@anchor-protocol/token-icons';
import { useDeploymentTarget } from '@anchor-protocol/app-provider';
import { useNavigate } from 'react-router-dom';
import { useAssetPriceInUstQuery } from 'queries';
import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { Sub } from 'components/Sub';
import { CardHeading } from './Card';

const AncTradeBase = (props: UIElementProps) => {
  const { className } = props;

  const { data: ancPrice } = useAssetPriceInUstQuery('anc');

  const navigate = useNavigate();

  const {
    target: { isNative },
  } = useDeploymentTarget();

  const onClick = isNative ? () => navigate(`/trade/buy`) : undefined;

  return (
    <ButtonCard onClick={onClick}>
      <div className={className}>
        <Circles className="icon" backgroundColors={['#2C2C2C']} radius={24}>
          <GifIcon
            src={anc160gif}
            style={{ fontSize: '2em', borderRadius: '50%' }}
          />
        </Circles>
        <CardHeading className="heading" title="Anchor (ANC)" />
        <div className="price">
          <AnimateNumber format={formatUSTWithPostfixUnits}>
            {ancPrice || ('0' as UST)}
          </AnimateNumber>{' '}
          <Sub>UST</Sub>
        </div>
      </div>
    </ButtonCard>
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
