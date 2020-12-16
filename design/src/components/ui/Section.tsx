import { flat } from '@ssen/styled-neumorphism';
import styled from 'styled-components';

export const Section = styled.section`
  border-radius: 20px;

  ${({ theme }) =>
    flat({
      color: theme.backgroundColor,
      distance: 6,
      intensity: theme.intensity,
    })};
`;
