import styled from 'styled-components';

export const GraphTick = styled.span`
  font-size: 11px;
  font-weight: 300;
  color: ${({ theme }) => theme.dimTextColor};

  top: -18px;
  transform: translateX(-50%);

  word-break: keep-all;
  white-space: nowrap;

  user-select: none;

  &::before {
    content: '';
    height: 5px;
    border-left: solid 1px currentColor;
    position: absolute;
    left: calc(50% - 1px);
    bottom: -5px;
    z-index: 1;
  }
`;
