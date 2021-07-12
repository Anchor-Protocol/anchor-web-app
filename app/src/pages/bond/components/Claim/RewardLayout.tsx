import styled from 'styled-components';

export const RewardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  grid-row-gap: 11px;

  > h4 {
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.textColor};

    grid-column: 1/3;
  }

  > p {
    font-size: 40px;
    font-weight: 300;

    span {
      margin-left: 0.3em;
      font-size: 0.5em;
      font-weight: 400;
    }
  }

  > button {
    height: 44px;
    min-width: 148px;
  }

  @media (max-width: 650px) {
    display: block;
    text-align: center;

    > h4 {
      margin-bottom: 1em;
    }

    > p {
      font-size: clamp(20px, 10vw, 40px);
    }

    > button {
      width: 100%;
      min-width: unset;
      max-width: 400px;
      margin-top: 1em;
    }
  }
`;
