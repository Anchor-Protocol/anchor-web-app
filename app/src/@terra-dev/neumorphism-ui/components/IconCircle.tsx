import styled from 'styled-components';

export const IconCircle = styled.div`
  border-radius: 50%;
  background-color: ${({ theme }) => theme.backgroundColor};
  display: inline-grid;
  min-width: 56px;
  max-width: 56px;
  min-height: 56px;
  max-height: 56px;
  place-content: center;
  color: ${({ theme }) => theme.dimTextColor};
`;
