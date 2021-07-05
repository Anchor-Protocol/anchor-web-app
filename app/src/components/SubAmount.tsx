import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';

export const StyledSubAmount = styled.div`
  color: ${({ theme }) => theme.dimTextColor};
`;

export const SubAmount = fixHMR(StyledSubAmount);
