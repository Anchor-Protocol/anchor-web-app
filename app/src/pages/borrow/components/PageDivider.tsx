import { horizontalRuler } from '@libs/styled-neumorphism';
import styled from 'styled-components';

export const PageDivider = styled.hr`
  ${({ theme }) =>
    horizontalRuler({
      color: theme.sectionBackgroundColor,
      intensity: theme.intensity,
    })};

  height: 5px;

  margin: 10px -60px 0 -60px; // dialog content has a 60px padding so this is the easiest way
`;
