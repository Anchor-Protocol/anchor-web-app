import { computeApy } from '@anchor-protocol/app-fns';
import {
  useAnchorWebapp,
  useEarnAPYHistoryQuery,
  useEarnEpochStatesQuery,
} from '@anchor-protocol/app-provider';
import { Rate } from '@anchor-protocol/types';
import {
  APYChart,
  APYChartItem,
} from '@anchor-protocol/webapp-charts/APYChart';
import { formatRate } from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { TooltipLabel } from '@libs/neumorphism-ui/components/TooltipLabel';
import { AnimateNumber } from '@libs/ui';
import { isSameDay } from 'date-fns';
import { useDepositApy } from 'hooks/useDepositApy';
import { useEarnApyProjectionQuery } from 'queries';
import React, { useMemo } from 'react';
import { EarnApyProjection } from './EarnApyProjection';

export interface InterestSectionProps {
  className?: string;
}

export function InterestSection({ className }: InterestSectionProps) {
  const { constants } = useAnchorWebapp();

  const { data: { apyHistory } = {} } = useEarnAPYHistoryQuery();
  const { data: { overseerEpochState, overseerConfig } = {} } =
    useEarnEpochStatesQuery();

  const apy = useDepositApy();

  const { data: earnApyProjection } = useEarnApyProjectionQuery();

  const apyChartItems = useMemo<APYChartItem[] | undefined>(() => {
    const history = apyHistory
      ?.map(({ Timestamp, DepositRate }) => ({
        date: new Date(Timestamp * 1000),
        value: computeApy(
          DepositRate,
          constants.blocksPerYear,
          overseerConfig?.epoch_period ?? 1,
        ).toNumber() as Rate<number>,
      }))
      .reverse();

    return history && overseerEpochState
      ? [
          ...history,
          ...(history.length === 0 || isSameDay(history[0].date, new Date())
            ? [
                {
                  date: new Date(),
                  value: apy.toNumber() as Rate<number>,
                },
              ]
            : []),
        ]
      : undefined;
  }, [
    apyHistory,
    constants.blocksPerYear,
    apy,
    overseerEpochState,
    overseerConfig,
  ]);

  return (
    <Section className={className}>
      <h2>
        <IconSpan>
          INTEREST <InfoTooltip>Current annualized deposit rate</InfoTooltip>
        </IconSpan>
      </h2>

      <div className="apy">
        <TooltipLabel
          className="name"
          title="Annual Percentage Yield"
          placement="top"
          style={{ border: 'none' }}
        >
          APY
        </TooltipLabel>
        <div className="value">
          <AnimateNumber format={formatRate}>{apy}</AnimateNumber>%
        </div>
        <p
          style={{ opacity: earnApyProjection !== undefined ? 1 : 0 }}
          className="projectedValue"
        >
          {earnApyProjection && (
            <EarnApyProjection
              height={earnApyProjection.height}
              rate={earnApyProjection.rate}
            />
          )}
        </p>
        {apyChartItems && (
          <APYChart
            margin={{ top: 20, bottom: 20, left: 100, right: 100 }}
            gutter={{ top: 30, bottom: 20, left: 100, right: 100 }}
            data={apyChartItems}
            minY={() => -0.03}
            maxY={(...values) => Math.max(...values, 0.3)}
          />
        )}
      </div>
    </Section>
  );
}
