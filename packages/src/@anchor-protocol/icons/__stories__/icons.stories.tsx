import { Children, ReactElement } from 'react';
import styled from 'styled-components';
import { Discord, Wallet, ArrowDown } from '../';

export default {
  title: 'assets/Icons',
};

export const Icons = () => {
  return (
    <Grid size={60}>
      <Wallet />
      <Discord />
      <ArrowDown />
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
  grid-template-rows: repeat(auto-fill, ${({ size }) => size}px);

  div {
    display: grid;
    place-content: center;
  }
`;
