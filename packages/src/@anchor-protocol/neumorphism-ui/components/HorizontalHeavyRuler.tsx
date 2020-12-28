import { pressed } from '@anchor-protocol/styled-neumorphism';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled from 'styled-components';

export interface HorizontalHeavyRulerProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement> {
  className?: string;
  rulerWidth?: number;
}

const defaultRulerWidth: number = 5;

function HorizontalHeavyRulerBase({ className }: HorizontalHeavyRulerProps) {
  return <hr className={className} />;
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
