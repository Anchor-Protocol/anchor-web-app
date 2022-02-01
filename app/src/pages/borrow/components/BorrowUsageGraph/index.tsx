// import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
// import { Rate, u, UST } from '@anchor-protocol/types';
// import { demicrofy, formatRate } from '@libs/formatter';
// import { HorizontalGraphBar } from '@libs/neumorphism-ui/components/HorizontalGraphBar';
// import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
// import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
// import big, {BigSource } from 'big.js';
import React from 'react';
// import { useMediaQuery } from 'react-responsive';
// import { useTheme } from 'styled-components';
// import { GraphLabel } from './GraphLabel';
// import {
//   colorFunction,
//   labelRenderer,
//   RenderData,
//   valueFunction,
// } from './render';

const BorrowUsageGraph = () => {
  // const borrowLimit = "123456789000" as u<UST>;

  // const data = [
  //   // {
  //   //   position: 'top-marker',
  //   //   label: `${formatRate(maxLtv)}% LTV${isSmallScreen ? '' : ' (MAX)'}`,
  //   //   color: 'rgba(0, 0, 0, 0)',
  //   //   textAlign: 'right',
  //   //   value: maxLtv.toNumber(),
  //   //   tooltip:
  //   //     'Maximum allowed loan to value (LTV) ratio, collaterals will be liquidated when the LTV is bigger than this value.',
  //   // },
  //   // {
  //   //   position: 'top-marker',
  //   //   label: `${formatRate(safeLtv)}% LTV`,
  //   //   color: 'rgba(0, 0, 0, 0)',
  //   //   textAlign: 'right',
  //   //   value: big(safeLtv).toNumber(),
  //   //   tooltip: 'Recommended LTV',
  //   // }

  //   {
  //     position: 'top-marker',
  //     label: `${formatRate("1" as Rate<BigSource>)}% LTV`,
  //     color: 'rgba(0, 0, 0, 0)',
  //     textAlign: 'right',
  //     value: big(1).toNumber(),
  //     tooltip: 'Recommended LTV',
  //   }
  // ];

  return (
    <div>asdklj</div>
    // <HorizontalGraphBar<RenderData>
    //   min={0}
    //   max={100}
    //   animate
    //   data={data}
    //   colorFunction={colorFunction}
    //   valueFunction={valueFunction}
    //   labelRenderer={labelRenderer}>
    //   <GraphLabel style={{ left: 0 }}>
    //     <IconSpan>
    //       LTV <InfoTooltip>Loan-to-value ratio</InfoTooltip>
    //     </IconSpan>
    //   </GraphLabel>
    //   <GraphLabel style={{ right: 0 }}>
    //     <IconSpan>
    //       Borrow Limit: ${formatUSTWithPostfixUnits(demicrofy(borrowLimit))}{' '}
    //       <InfoTooltip>
    //         The maximum amount of liability permitted from deposited collaterals
    //       </InfoTooltip>
    //     </IconSpan>
    //   </GraphLabel>
    // </HorizontalGraphBar>
  );
};

export { BorrowUsageGraph };
