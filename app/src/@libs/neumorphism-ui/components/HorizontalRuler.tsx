import { horizontalRuler } from '@libs/styled-neumorphism';
import styled from 'styled-components';

/**
 * Styled `<hr/>` tag
 */
export const HorizontalRuler = styled.hr`
  ${({ theme }) =>
    horizontalRuler({
      color: theme.backgroundColor,
      intensity: theme.intensity,
    })};
`;
