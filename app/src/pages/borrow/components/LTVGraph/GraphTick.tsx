import styled from 'styled-components';

export const GraphTick = styled.span`
  font-size: 11px;
  font-weight: 300;
  color: ${({ theme }) => theme.dimTextColor};

  top: -28px;
  transform: translateX(-100%);

  word-break: keep-all;
  white-space: nowrap;

  user-select: none;

  &::before {
    content: '';
    height: 11px;
    border-left: solid 1px currentColor;
    position: absolute;
    left: calc(100% - 1px);
    bottom: -13px;
    z-index: 1;
  }
`;
