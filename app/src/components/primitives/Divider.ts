import { horizontalRuler } from '@libs/styled-neumorphism';
import styled from 'styled-components';

export const Divider = styled.hr`
  ${({ theme }) =>
    horizontalRuler({
      color: theme.sectionBackgroundColor,
      intensity: theme.intensity,
    })};

  height: 5px;
  border-radius: 3px;
  margin: 10px 0;
`;
