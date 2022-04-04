import { horizontalRuler } from '@libs/styled-neumorphism';
import styled from 'styled-components';

export const PageDivider = styled.hr`
  ${({ theme }) =>
    horizontalRuler({
      color: theme.sectionBackgroundColor,
      intensity: theme.intensity,
    })};

  height: 5px;

  margin: 10px 0;
`;
