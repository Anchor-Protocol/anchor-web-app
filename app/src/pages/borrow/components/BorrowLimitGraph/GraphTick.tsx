import styled from 'styled-components';

export const GraphTick = styled.span`
  font-size: 14px;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  top: -30px;
  transform: translateX(-50%);

  &::before {
    content: '';
    height: 11px;
    border-left: solid 1px currentColor;
    position: absolute;
    left: calc(50% - 1px);
    bottom: -13px;
    z-index: 1;
  }
`;
