import { horizontalDashedRuler } from '@libs/styled-neumorphism';
import React from 'react';
import styled from 'styled-components';

export interface HorizontalDashedRulerProps {
  className?: string;
  dash?: number;
  gap?: number;
}

function HorizontalDashedRulerBase({
  className,
  dash,
  gap,
}: HorizontalDashedRulerProps) {
  return <div className={className} data-dash={dash} data-gap={gap} />;
}

export const HorizontalDashedRuler = styled(HorizontalDashedRulerBase)`
  ${({ theme, dash, gap }) =>
    horizontalDashedRuler({
      color: theme.backgroundColor,
      intensity: theme.intensity,
      dash,
      gap,
    })};
`;
