import styled from 'styled-components';
import { rulerLightColor, rulerShadowColor } from '@libs/styled-neumorphism';

export const Marker = styled.span`
  top: -50px;

  > span {
    display: inline-block;

    font-size: 11px;
    font-weight: 300;
    color: ${({ theme }) => theme.dimTextColor};

    transform: translateX(-100%);

    word-break: keep-all;
    white-space: nowrap;

    user-select: none;

    sup {
      xmargin-right: 4px;
    }

    .text {
      margin: 0 10px 0 0;
      padding: 0;
    }

    &::after {
      content: '';
      height: 50px;
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
      left: calc(100% - 1px);
      bottom: -35px;
      z-index: 1;
    }
  }
`;
