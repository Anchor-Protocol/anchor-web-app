import { horizontalRuler } from '@ssen/styled-neumorphism';
import styled from 'styled-components';

export const HorizontalRuler = styled.hr`
  ${({ theme }) =>
    horizontalRuler({
      color: theme.backgroundColor,
      intensity: theme.intensity,
    })};
`;
