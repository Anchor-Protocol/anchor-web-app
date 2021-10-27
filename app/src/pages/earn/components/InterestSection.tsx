import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { TooltipLabel } from '@libs/neumorphism-ui/components/TooltipLabel';
import React from 'react';
import { useTheme } from 'styled-components';

export interface InterestSectionProps {
  className?: string;
}

export function InterestSection({ className }: InterestSectionProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const theme = useTheme();

  // const { constants } = useAnchorWebapp();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  // const { data: { apyHistory } = {} } = useEarnAPYHistoryQuery();

  // const { data: { overseerEpochState } = {} } = useEarnEpochStatesQuery();

  // ---------------------------------------------
  // computes
  // ---------------------------------------------
  // const apy = useMemo(() => {
  //   return computeCurrentAPY(overseerEpochState, constants.blocksPerYear);
  // }, [constants.blocksPerYear, overseerEpochState]);

  // const apyChartItems = useMemo<APYChartItem[] | undefined>(() => {
  //   const history = apyHistory
  //     ?.map(({ Timestamp, DepositRate }) => ({
  //       date: new Date(Timestamp * 1000),
  //       value: (parseFloat(DepositRate) *
  //         constants.blocksPerYear) as Rate<number>,
  //     }))
  //     .reverse();

  //   return history && overseerEpochState
  //     ? [
  //         ...history,
  //         {
  //           date: new Date(),
  //           value: big(overseerEpochState.deposit_rate)
  //             .mul(constants.blocksPerYear)
  //             .toNumber() as Rate<number>,
  //         },
  //       ]
  //     : undefined;
  // }, [apyHistory, constants.blocksPerYear, overseerEpochState]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
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
          style={{ borderColor: theme.colors.positive }}
        >
          APY
        </TooltipLabel>
        <div className="value">3%</div>
        {/* {apyChartItems && (
          <APYChart
            margin={{ top: 20, bottom: 20, left: 100, right: 100 }}
            gutter={{ top: 30, bottom: 20, left: 100, right: 100 }}
            data={apyChartItems}
            minY={() => -0.03}
            maxY={(...values) => Math.max(...values, 0.3)}
          />
        )} */}
      </div>
    </Section>
  );
}
