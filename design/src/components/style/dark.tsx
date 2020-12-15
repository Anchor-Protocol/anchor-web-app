import styled, { css } from 'styled-components';

export const backgroundStyle = css`
  background-color: #1a1d2e;
`;

export const Title = styled.h1`
  width: 101px;
  height: 41px;
  font-family: Gotham;
  font-size: 34px;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #f0f0f0;
`;

export const Box = styled.section`
  border-radius: 20px;
  background: #1a1d2e;
  box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.2),
    -6px -6px 10px rgba(255, 255, 255, 0.03);
`;

export const BoxTitle = styled.h3`
  margin: 0;
  font-family: Gotham;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.3px;
  color: #ffffff;
`;

export const HorizontalRuler = styled.hr`
  padding: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  border-left: 0;
  border-right: 0;
`;

export const Button = styled.div`
  height: 42px;
  border-radius: 21px;
  background: #282d46;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2),
    -2px -2px 5px rgba(255, 255, 255, 0.03);

  &:active {
  }

  display: grid;
  place-content: center;

  font-family: Gotham;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.39;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
`;
