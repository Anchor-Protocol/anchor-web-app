import { Rate, UST } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import { AnimateNumber, UIElementProps } from '@libs/ui';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { ButtonCard } from './ButtonCard';
import { Circles } from 'components/primitives/Circles';
import { anc160gif, GifIcon } from '@anchor-protocol/token-icons';
import { TooltipLabel } from '@libs/neumorphism-ui/components/TooltipLabel';
import {
  useBorrowAPYQuery,
  useDeploymentTarget,
} from '@anchor-protocol/app-provider';
import { useNavigate } from 'react-router-dom';
import { useAssetPriceInUstQuery } from 'queries';
import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';

interface ValueProps {
  label: string;
  tooltip: string;
  children: ReactNode;
}

const Value = (props: ValueProps) => {
  const { label, tooltip, children } = props;
  return (
    <div className="value">
      <TooltipLabel title={tooltip} placement="top">
        {label}
      </TooltipLabel>
      <p>{children}</p>
    </div>
  );
};

const AncTradeBase = (props: UIElementProps) => {
  const { className } = props;

  const { data: ancPrice } = useAssetPriceInUstQuery('anc');

  const { data: { govRewards } = {} } = useBorrowAPYQuery();

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
        <h2>Anchor (ANC)</h2>
        <div className="values">
          <Value label="Price" tooltip="The current price of ANC.">
            <AnimateNumber format={formatUSTWithPostfixUnits}>
              {ancPrice || ('0' as UST)}
            </AnimateNumber>
            {' UST'}
          </Value>
          <Value
            label="APR"
            tooltip="Annualized ANC staking return based on the ANC distribution and staking ratio"
          >
            <AnimateNumber format={formatRate}>
              {govRewards && govRewards.length > 0
                ? govRewards[0].CurrentAPY
                : (0 as Rate<number>)}
            </AnimateNumber>
            {' %'}
          </Value>
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
