import { Rate } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import { AnimateNumber, UIElementProps } from '@libs/ui';
import React from 'react';
import styled from 'styled-components';
import { ButtonCard } from './ButtonCard';
import { Circles } from 'components/primitives/Circles';
import { anc160gif, GifIcon } from '@anchor-protocol/token-icons';
import { TooltipLabel } from '@libs/neumorphism-ui/components/TooltipLabel';

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

const AncTradeBase = (props: UIElementProps) => {
  const { className } = props;

  return (
    <ButtonCard>
      <div className={className}>
        <Circles className="icon" backgroundColors={['#2C2C2C']} radius={24}>
          <GifIcon
            src={anc160gif}
            style={{ fontSize: '2em', borderRadius: '50%' }}
          />
        </Circles>
        <h2>Anchor (ANC)</h2>
        <div className="values">
          <Value label="Price" />
          <Value label="APR" />
        </div>
      </div>
    </ButtonCard>
  );
};

export const AncTrade = styled(AncTradeBase)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    // grid-column: 2;
    // grid-row: 1;
    font-size: 18px;
    font-weight: 700;
    margin-top: 10px;
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
