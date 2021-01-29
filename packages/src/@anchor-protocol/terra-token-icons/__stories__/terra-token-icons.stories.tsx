import { Children, ReactElement } from 'react';
import styled from 'styled-components';
import {
  AUT,
  CAT,
  CHT,
  CNT,
  EUT,
  GBT,
  HKT,
  INT,
  JPT,
  KRT,
  Luna,
  MNT,
  SDT,
  SGT,
  UST,
} from '../';

export default {
  title: 'assets/TerraTokenIcons',
};

export const Terra_Token_Icons = () => {
  return (
    <Grid size={100}>
      <AUT />
      <CAT />
      <CHT />
      <CNT />
      <EUT />
      <GBT />
      <HKT />
      <INT />
      <JPT />
      <KRT />
      <Luna />
      <MNT />
      <SDT />
      <SGT />
      <UST />
    </Grid>
  );
};

const Grid = styled(
  ({
    children,
    className,
  }: {
    children: ReactElement[];
    className?: string;
  }) => (
    <section className={className}>
      {Children.toArray(children.map((child) => <div>{child}</div>))}
    </section>
  ),
)<{ size: number }>`
  display: grid;
  grid-template-columns: repeat(5, ${({ size }) => size}px);
  grid-template-rows: repeat(5, ${({ size }) => size}px);

  div {
    display: grid;
    place-content: center;

    img {
      font-size: ${({ size }) => size - 10}px;
      width: 1em;
      height: 1em;
    }
  }
`;
