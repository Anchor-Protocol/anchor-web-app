import styled from 'styled-components';

export const IconSpan = styled.span`
  word-break: keep-all;
  white-space: nowrap;

  svg,
  .MuiSvgIcon-root {
    font-size: 1em;
    transform: translateY(0.15em);
  }

  sup {
    vertical-align: unset;

    svg,
    .MuiSvgIcon-root {
      vertical-align: text-top;
      color: ${({ theme }) => theme.dimTextColor};
      opacity: 0.4;
      font-size: 13px;
      transform: translateY(-1px);
    }
  }

  sub {
    vertical-align: unset;

    svg,
    .MuiSvgIcon-root {
      vertical-align: text-bottom;
      color: ${({ theme }) => theme.dimTextColor};
      opacity: 0.4;
      font-size: min(1em, 13px);
    }
  }
`;
