import { horizontalRuler } from '@anchor-protocol/styled-neumorphism';
import styled from 'styled-components';

export const HorizontalRuler = styled.hr`
  ${({ theme }) =>
    horizontalRuler({
      color: theme.backgroundColor,
      intensity: theme.intensity,
    })};
`;
