import styled from 'styled-components';

export const GraphMarkerTick = styled.span<{
  textAlign?: 'left' | 'center' | 'right';
}>`
  top: -50px;

  > span {
    display: inline-block;

    font-size: 12px;
    font-weight: 300;
    color: ${({ theme }) => theme.dimTextColor};

    transform: ${({ textAlign = 'center' }) =>
      textAlign === 'center'
        ? `translateX(-50%)`
        : textAlign === 'right'
        ? `translateX(-100%)`
        : ''};

    sup {
      margin-left: 4px;
    }

    &::before {
      content: '';
      height: 30px;
      border-left: dotted 1px currentColor;
      position: absolute;
      left: ${({ textAlign = 'center' }) =>
        textAlign === 'center'
          ? `calc(50% - 1px)`
          : textAlign === 'right'
          ? `calc(100% - 1px)`
          : ''};
      bottom: -35px;
      z-index: 1;
    }
  }
`;
