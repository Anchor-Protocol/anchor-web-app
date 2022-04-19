import { sum } from 'lodash';

import { HSLA } from '.';

const paletteColorSaturation = 219;
const paletteColorLightness = 75;

export const paletteColorsCount = 12;

const paletteHueRanges = [[0, 360]];

const paletteHueCoverage = paletteHueRanges.map(([start, end]) => end - start);
const paletteHueTotalCoverage = sum(paletteHueCoverage);
const paletteHueRangesInterval = paletteHueCoverage.reduce(
  (acc, coverage, index) => {
    const previousPoint = acc[index - 1] || 0;
    const point = previousPoint + coverage / paletteHueTotalCoverage;

    return [...acc, point];
  },
  [] as number[],
);

export const getPaletteColor = (index: number): HSLA => {
  const pointOnInterval = (index % paletteColorsCount) / paletteColorsCount;
  const rangeIndex = paletteHueRangesInterval.findIndex(
    (point) => pointOnInterval < point,
  );

  const intervalStart = paletteHueRangesInterval[rangeIndex - 1] || 0;
  const intervalEnd = paletteHueRangesInterval[rangeIndex];
  const intevalLength = intervalEnd - intervalStart;

  const range = paletteHueRanges[rangeIndex];
  const rangeCoverage = paletteHueCoverage[rangeIndex];

  const hue =
    range[0] +
    rangeCoverage * ((pointOnInterval - intervalStart) / intevalLength);

  return [hue, paletteColorSaturation, paletteColorLightness, 1];
};
