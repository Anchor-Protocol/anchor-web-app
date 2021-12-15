import styled from 'styled-components';

export const ChartTooltip = styled.div`
  position: absolute;
  pointer-events: none;
  opacity: 0;
  left: 0;
  top: 0;

  transition: opacity 0.1s ease-out, transform 0.2s ease-in-out;

  > section {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    transform: translateX(-50%);

    > div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
      min-width: 40px;
      background-color: ${({ theme }) => theme.textColor};
      color: ${({ theme }) => theme.sectionBackgroundColor};
      padding: 5px 10px;
      border-radius: 14px;
      font-size: 11px;

      span {
        color: ${({ theme }) => theme.sectionBackgroundColor};
        opacity: 0.7;
        margin-left: 10px;
      }
    }
  }

  > hr {
    position: absolute;
    left: 0;
    top: 0;
    border: 0;
    border-left: 1px dashed ${({ theme }) => theme.dimTextColor};
    width: 1px;
  }
`;
