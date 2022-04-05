import React, { forwardRef } from 'react';
import { NeumorphismTheme } from '../themes/Theme';
import { withTheme } from 'styled-components';
import { UIElementProps } from '@libs/ui';

const SvgThumb = withTheme(({ theme }: { theme: NeumorphismTheme }) => (
  <svg
    width={22}
    height={22}
    style={{
      borderRadius: '50%',
      backgroundColor: theme.slider.thumb.thumbColor,
      boxShadow: '0px 0px 6px 2px rgba(0, 0, 0, 0.18)',
    }}
  >
    <circle cx={11} cy={11} r={2} fill="darkgray" />
  </svg>
));

interface HorizontalGraphSliderThumbProps
  extends Omit<UIElementProps, 'children'> {
  position: number;
}

export const HorizontalGraphSliderThumb = forwardRef<
  HTMLDivElement,
  HorizontalGraphSliderThumbProps
>((props: HorizontalGraphSliderThumbProps, ref) => {
  const { className, position } = props;
  return (
    <div
      ref={ref}
      className={className}
      style={{
        left: position,
      }}
    >
      <SvgThumb />
    </div>
  );
});

// export const HorizontalGraphSliderThumb = forwardRef((
//   props: HorizontalGraphSliderThumbProps, ref)
//  => ({
//   const { className, position } = props;
//   return (
//     <div
//       ref={ref}
//       className={className}
//       style={{
//         left: position,
//       }}
//     >
//       <SvgThumb />
//     </div>
//   );
// }));
