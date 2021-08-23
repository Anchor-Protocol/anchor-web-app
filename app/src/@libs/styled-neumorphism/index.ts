import c from 'color';

/**
 * @see https://neumorphism.io/#7380c9
 */
interface NeumorphismValues {
  /** Base color ( background color and object background color ) */
  color: string;

  /** If object background color is different with outside background color */
  backgroundColor?: string;

  /**
   * Distance
   *
   * @see https://neumorphism.io/#7380c9
   */
  distance: number;

  /**
   * Intensity
   *
   * @see https://neumorphism.io/#7380c9
   */
  intensity: number;

  /**
   * Blur ratio
   *
   * @default 1
   */
  blurWeight?: number;
}

export function boxShadowColor({
  intensity,
  color,
}: Pick<NeumorphismValues, 'intensity'> & { color: string }): string {
  return c(color).darken(intensity).string();
}

export function boxLightColor({
  intensity,
  color,
}: Pick<NeumorphismValues, 'intensity'> & { color: string }): string {
  return c(color)
    .lighten(intensity + 0.15)
    .saturate(-0.2)
    .string();
}

export function flat({
  color,
  backgroundColor = color,
  distance,
  intensity,
  blurWeight = 1,
}: NeumorphismValues) {
  const blur: number = (10 + 2 * (distance - 5)) * blurWeight;

  return `
    background: ${color};
    box-shadow: ${distance}px
                ${distance}px
                ${blur}px
                ${boxShadowColor({ intensity, color: backgroundColor })},
                
                -${distance}px
                -${distance}px
                ${blur}px
                ${boxLightColor({ intensity, color: backgroundColor })};
  `;
}

export function concave({
  color,
  backgroundColor = color,
  distance,
  intensity,
  blurWeight = 1,
}: NeumorphismValues) {
  const blur: number = (10 + 2 * (distance - 5)) * blurWeight;

  // TODO find the weight ratio by color luminance

  return `
    background: linear-gradient(
                  145deg,
                  ${c(color).darken(0.05).string()},
                  ${c(color).lighten(0.05).string()}
                );
    box-shadow: ${distance}px
                ${distance}px
                ${blur}px
                ${boxShadowColor({ intensity, color: backgroundColor })},
                
                -${distance}px
                -${distance}px
                ${blur}px
                ${boxLightColor({ intensity, color: backgroundColor })};
  `;
}

export function convex({
  color,
  backgroundColor = color,
  distance,
  intensity,
  blurWeight = 1,
}: NeumorphismValues) {
  const blur: number = (10 + 2 * (distance - 5)) * blurWeight;

  // TODO find the weight ratio by color luminance

  return `
    background: linear-gradient(
                  145deg,
                  ${c(color).lighten(0.05).string()},
                  ${c(color).darken(0.05).string()}
                );
    box-shadow: ${distance}px
                ${distance}px
                ${blur}px
                ${boxShadowColor({ intensity, color: backgroundColor })},
                
                -${distance}px
                -${distance}px
                ${blur}px
                ${boxLightColor({ intensity, color: backgroundColor })};
  `;
}

export function pressed({
  color,
  backgroundColor = color,
  distance,
  intensity,
  blurWeight = 1,
}: NeumorphismValues) {
  const blur: number = (10 + 2 * (distance - 5)) * blurWeight;

  return `
    background: ${color};
    box-shadow: inset
                ${distance}px
                ${distance}px
                ${blur}px
                ${boxShadowColor({ intensity, color: backgroundColor })},
                
                inset
                -${distance}px
                -${distance}px
                ${blur}px
                ${boxLightColor({ intensity, color: backgroundColor })};
  `;
}

export function softPressed({
  color,
  backgroundColor = color,
  distance,
  intensity,
  blurWeight = 1,
}: NeumorphismValues) {
  const blur: number = (10 + 2 * (distance - 5)) * blurWeight;

  return `
    background: ${color};
    box-shadow: -${distance}px
                -${distance}px
                ${blur}px
                ${boxShadowColor({ intensity, color: backgroundColor })},
                
                ${distance}px
                ${distance}px
                ${blur}px
                ${boxLightColor({ intensity, color: backgroundColor })};
  `;
}

export function rulerLightColor({
  intensity,
  color,
}: Pick<NeumorphismValues, 'intensity'> & { color: string }): string {
  const ratio = c(color).isLight() ? intensity * 2 : intensity;
  return c(color).lighten(ratio).string();
}

export function rulerShadowColor({
  intensity,
  color,
}: Pick<NeumorphismValues, 'intensity'> & { color: string }) {
  const ratio = c(color).isLight() ? intensity * 0.7 : intensity * 1.2;
  return c(color).darken(ratio).string();
}

export function horizontalRuler({
  intensity,
  ...colors
}: Pick<NeumorphismValues, 'intensity'> &
  ({ color: string } | { topColor: string; bottomColor: string })) {
  const { topColor, bottomColor } =
    'topColor' in colors
      ? colors
      : {
          topColor: colors.color,
          bottomColor: colors.color,
        };
  return `
    padding: 0;
    border-top: 1px solid ${rulerShadowColor({ intensity, color: topColor })};
    border-bottom: 1px solid ${rulerLightColor({
      intensity,
      color: bottomColor,
    })};
    border-left: 0;
    border-right: 0;
  `;
}

export function verticalRuler({
  intensity,
  ...colors
}: Pick<NeumorphismValues, 'intensity'> &
  ({ color: string } | { leftColor: string; rightColor: string })) {
  const { leftColor, rightColor } =
    'leftColor' in colors
      ? colors
      : {
          leftColor: colors.color,
          rightColor: colors.color,
        };
  return `
    padding: 0;
    border-left: 1px solid ${rulerShadowColor({ intensity, color: leftColor })};
    border-right: 1px solid ${rulerLightColor({
      intensity,
      color: rightColor,
    })};
    border-top: 0;
    border-bottom: 0;
  `;
}

export function horizontalDashedRuler({
  intensity,
  dash = 4,
  gap = 4,
  ...colors
}: Pick<NeumorphismValues, 'intensity'> & { dash?: number; gap?: number } & (
    | { color: string }
    | { topColor: string; bottomColor: string }
  )) {
  const dashPercentage = (dash / (dash + gap)) * 100;

  const { topColor, bottomColor } =
    'topColor' in colors
      ? colors
      : {
          topColor: colors.color,
          bottomColor: colors.color,
        };

  return `
    min-height: 2px;
    max-height: 2px;
    font-size: 0;
    padding: 0;
    
    background-image: linear-gradient(to right, ${rulerShadowColor({
      intensity,
      color: topColor,
    })} ${dashPercentage}%, rgba(255, 255, 255, 0) 0%), linear-gradient(to right, ${rulerLightColor(
    {
      intensity,
      color: bottomColor,
    },
  )} ${dashPercentage}%, rgba(255, 255, 255, 0) 0%);
    background-position: top, bottom;
    background-size: ${dash + gap}px 1px;
    background-repeat: repeat-x;
  `;
}
