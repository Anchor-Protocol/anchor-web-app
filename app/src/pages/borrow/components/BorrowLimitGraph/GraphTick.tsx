import styled from 'styled-components';

export const GraphTick = styled.span`
  top: -30px;

  > span {
    display: inline-block;

    font-size: 14px;
    font-weight: 300;
    color: ${({ theme }) => theme.textColor};

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
  }
`;
