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
  box-shadow: 6px 6px 10px 0 rgba(0, 0, 0, 0.2),
    -6px -6px 10px 0 rgba(255, 255, 255, 0.03);
  border-style: solid;
  border-width: 1px;
  border-image-source: linear-gradient(
    111deg,
    rgba(0, 0, 0, 0.05) 38%,
    rgba(255, 255, 255, 0.05) 100%
  );
  border-image-slice: 1;
  background-image: linear-gradient(to bottom, #1a1d2e, #1a1d2e),
    linear-gradient(
      111deg,
      rgba(0, 0, 0, 0.05) 38%,
      rgba(255, 255, 255, 0.05) 100%
    );
  background-origin: border-box;
  background-clip: content-box, border-box;
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

export const Button = styled.button`
  min-width: 100px;
  height: 42px;
  padding: 11px 172px 11px 173px;
  border-radius: 21px;
  border-style: solid;
  border-width: 1px;
  border-image-source: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.07),
    rgba(0, 0, 0, 0.2) 78%
  );
  border-image-slice: 1;
  background-origin: border-box;
  background-color: #282d46;

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
