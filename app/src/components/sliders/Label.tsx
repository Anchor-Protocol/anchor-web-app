import styled from 'styled-components';

export const Label = styled.span`
  top: -28px;

  > span {
    cursor: pointer;
    display: inline-block;

    font-size: 12px;
    font-weight: 500;

    transform: translateX(-50%);

    user-select: none;

    word-break: keep-all;
    white-space: nowrap;
  }
`;
