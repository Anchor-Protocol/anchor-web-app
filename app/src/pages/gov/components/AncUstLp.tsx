import { Rate } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import { AnimateNumber, UIElementProps } from '@libs/ui';
import React from 'react';
import styled from 'styled-components';
import { ButtonCard } from './ButtonCard';
import { Circles } from 'components/primitives/Circles';
import { anc160gif, GifIcon, TokenIcon } from '@anchor-protocol/token-icons';
import { TooltipLabel } from '@libs/neumorphism-ui/components/TooltipLabel';
import { useDeploymentTarget } from '@anchor-protocol/app-provider';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'pages/trade/env';
import { CardHeading } from './Card';

interface ValueProps {
  label: string;
}

const Value = (props: ValueProps) => {
  const { label } = props;
  return (
    <div className="value">
      <TooltipLabel title="Lorem ipsum neset dolor" placement="top">
        {label}
      </TooltipLabel>
      <p>
        <AnimateNumber format={formatRate}>{0 as Rate<number>}</AnimateNumber> %
      </p>
    </div>
  );
};

const AncUstLpBase = (props: UIElementProps) => {
  const { className } = props;

  const navigate = useNavigate();

  const {
    target: { isNative },
  } = useDeploymentTarget();

  const onClick = isNative
    ? () => navigate(`/${ROUTES.ANC_UST_LP}/provide`)
    : undefined;

  return (
    <ButtonCard onClick={onClick}>
      <div className={className}>
        <Circles
          className="icon"
          backgroundColors={['#ffffff', '#2C2C2C']}
          radius={24}
        >
          <TokenIcon token="ust" style={{ fontSize: '1.1em' }} />
          <GifIcon
            src={anc160gif}
            style={{ fontSize: '2em', borderRadius: '50%' }}
          />
        </Circles>
        <CardHeading className="heading" title="ANC-UST LP" />
        <div className="values">
          <Value label="APR" />
          <Value label="Total Staked" />
          <Value label="Rewards" />
        </div>
      </div>
    </ButtonCard>
  );
};

export const AncUstLp = styled(AncUstLpBase)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  .heading {
    margin: 10px 0;
    text-align: center;
  }

  .values {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .value {
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        margin-top: 5px;
      }
    }
  }
`;
