import c from 'color';

/**
 * @see https://neumorphism.io/#7380c9
 */
interface NeumorphismValues {
  color: string;
  backgroundColor?: string;
  distance: number;
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

  return `
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

  return `
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

export function horizontalRule({
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
    border-top: 1px solid ${c(topColor)
      .darken(intensity * 1.7)
      .string()};
    border-bottom: 1px solid ${c(bottomColor)
      .lighten(intensity * 1.7)
      .string()};
    border-left: 0;
    border-right: 0;
  `;
}
