import { isValidElement, ReactNode } from 'react';
import styled from 'styled-components';

export interface CirclesProps {
  className?: string;
  children: ReactNode;
  radius?: number;
  backgroundColor?: string;
}

const defaultRadius = 40;

function CirclesBase({ className, children }: CirclesProps) {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children
            .filter((el) => isValidElement(el))
            .map((element, i) => <figure key={'circle' + i}>{element}</figure>)
        : isValidElement(children) && <figure>{children}</figure>}
    </div>
  );
}

export const Circles = styled(CirclesBase)`
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;

  figure {
    margin: 0;

    width: ${({ radius = defaultRadius }) => radius * 2}px;
    height: ${({ radius = defaultRadius }) => radius * 2}px;

    font-size: ${({ radius = defaultRadius }) => radius}px;

    display: grid;
    place-content: center;

    background-color: ${({ backgroundColor, theme }) =>
      backgroundColor ?? theme.highlightBackgroundColor};
    border-radius: 50%;

    &:not(:first-child) {
      margin-right: -${({ radius = defaultRadius }) => radius / 3}px;
      box-shadow: 2px 0 2px 0 rgba(0, 0, 0, 0.15);
    }
  }
`;
