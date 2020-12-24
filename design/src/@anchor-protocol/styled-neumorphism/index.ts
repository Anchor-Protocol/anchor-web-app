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
}

export function flat({
  color,
  backgroundColor = color,
  distance,
  intensity,
}: NeumorphismValues) {
  const blur: number = 10 + 2 * (distance - 5);

  return `
    transition: box-shadow 0.1s ease;
    background: ${color};
    box-shadow: ${distance}px
                ${distance}px
                ${blur}px
                ${c(backgroundColor).darken(intensity).string()},
                
                -${distance}px
                -${distance}px
                ${blur}px
                ${c(backgroundColor).lighten(intensity).string()};
  `;
}

export function concave({
  color,
  backgroundColor = color,
  distance,
  intensity,
}: NeumorphismValues) {
  const blur: number = 10 + 2 * (distance - 5);
  
  // TODO find the weight ratio by color luminance

  return `
    transition: box-shadow 0.1s ease;
    background: linear-gradient(
                  145deg,
                  ${c(color).darken(0.05).string()},
                  ${c(color).lighten(0.05).string()}
                );
    box-shadow: ${distance}px
                ${distance}px
                ${blur}px
                ${c(backgroundColor).darken(intensity).string()},
                
                -${distance}px
                -${distance}px
                ${blur}px
                ${c(backgroundColor).lighten(intensity).string()};
  `;
}

export function convex({
  color,
  backgroundColor = color,
  distance,
  intensity,
}: NeumorphismValues) {
  const blur: number = 10 + 2 * (distance - 5);
  
  // TODO find the weight ratio by color luminance

  return `
    transition: box-shadow 0.1s ease;
    background: linear-gradient(
                  145deg,
                  ${c(color).lighten(0.05).string()},
                  ${c(color).darken(0.05).string()}
                );
    box-shadow: ${distance}px
                ${distance}px
                ${blur}px
                ${c(backgroundColor).darken(intensity).string()},
                
                -${distance}px
                -${distance}px
                ${blur}px
                ${c(backgroundColor).lighten(intensity).string()};
  `;
}

export function pressed({
  color,
  backgroundColor = color,
  distance,
  intensity,
}: NeumorphismValues) {
  const blur: number = 10 + 2 * (distance - 5);

  return `
    transition: box-shadow 0.1s ease;
    background: ${color};
    box-shadow: inset
                ${distance}px
                ${distance}px
                ${blur}px
                ${c(backgroundColor).darken(intensity).string()},
                
                inset
                -${distance}px
                -${distance}px
                ${blur}px
                ${c(backgroundColor).lighten(intensity).string()};
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
