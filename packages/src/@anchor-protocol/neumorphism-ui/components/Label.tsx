import styled from 'styled-components';

export const Label = styled.span`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.label.textColor};
  background-color: ${({ theme }) => theme.label.backgroundColor};
  border: 1px solid ${({ theme }) => theme.label.borderColor};
  padding: 5px 19px;
  border-radius: 13px;
  display: inline-block;
  cursor: help;
`;
