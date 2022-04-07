import { Rate } from '@libs/types';
import { Big } from 'big.js';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import React from 'react';
import { AnimateNumber } from '@libs/ui';
import { formatRate } from '@libs/formatter';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { useEstimatedTimestamp } from 'queries';
import { format } from 'date-fns';

interface EarnApyProjectionProps {
  height: number;
  rate: Rate<Big>;
}
export const EarnApyProjection = ({ height, rate }: EarnApyProjectionProps) => {
  const timestamp = useEstimatedTimestamp(height);

  return (
    <IconSpan>
      Projected{' '}
      <b>
        <AnimateNumber format={formatRate}>{rate}</AnimateNumber>%
      </b>{' '}
      <InfoTooltip>
        Projected annualized deposit rate{' '}
        {timestamp ? `from ${format(timestamp, 'MMM d')}` : ''}
      </InfoTooltip>
    </IconSpan>
  );
};
