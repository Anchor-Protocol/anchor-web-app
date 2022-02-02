import styled from 'styled-components';
import { rulerLightColor, rulerShadowColor } from '@libs/styled-neumorphism';

export const GraphMarkerTick = styled.span<{
  textAlign?: 'left' | 'center' | 'right';
}>`
  top: -50px;

  > span {
    display: inline-block;

    font-size: 12px;
    font-weight: 300;
    color: ${({ theme }) => theme.dimTextColor};

    transform: ${({ textAlign = 'center' }) =>
      textAlign === 'center'
        ? `translateX(-50%)`
        : textAlign === 'right'
        ? `translateX(-100%)`
        : ''};

    sup {
      margin-left: 4px;
    }

    &::before {
      content: '';
      height: 30px;
      border-left: 1px solid
        ${({ theme }) =>
          rulerShadowColor({
            intensity: theme.intensity,
            color: theme.sectionBackgroundColor,
          })};
      border-right: 1px solid
        ${({ theme }) =>
          rulerLightColor({
            intensity: theme.intensity,
            color: theme.sectionBackgroundColor,
          })};
      position: absolute;
      left: ${({ textAlign = 'center' }) =>
        textAlign === 'center'
          ? `calc(50% - 1px)`
          : textAlign === 'right'
          ? `calc(100% - 1px)`
          : ''};
      bottom: -35px;
      z-index: 1;
    }
  }
`;
