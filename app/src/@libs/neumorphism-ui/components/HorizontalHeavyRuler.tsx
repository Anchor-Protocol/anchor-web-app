import { pressed } from '@libs/styled-neumorphism';
import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled from 'styled-components';

export interface HorizontalHeavyRulerProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement> {
  rulerWidth?: number;
}

const defaultRulerWidth: number = 5;

function HorizontalHeavyRulerBase({
  rulerWidth,
  ...hrProps
}: HorizontalHeavyRulerProps) {
  return <hr {...hrProps} />;
}

export const HorizontalHeavyRuler = styled(HorizontalHeavyRulerBase)`
  padding: 0;
  margin: 0;

  border: 0;

  height: ${({ rulerWidth = defaultRulerWidth }) => rulerWidth}px;
  border-radius: ${({ rulerWidth = defaultRulerWidth }) => rulerWidth / 2}px;

  ${({ theme }) =>
    pressed({
      color: theme.backgroundColor,
      distance: 1,
      intensity: theme.intensity,
    })};
`;
