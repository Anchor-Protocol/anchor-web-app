import styled from 'styled-components';

export const GraphLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textColor};
  top: 22px;
  transform: translateX(-50%);
  
  word-break: keep-all;
  white-space: nowrap;
`;
