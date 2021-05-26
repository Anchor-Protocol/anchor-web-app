import styled from 'styled-components';

export const IconSpan = styled.span<{ wordBreak?: boolean }>`
  word-break: ${({ wordBreak = true }) => (wordBreak ? 'keep-all' : 'unset')};
  white-space: ${({ wordBreak = true }) => (wordBreak ? 'nowrap' : 'unset')};

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
