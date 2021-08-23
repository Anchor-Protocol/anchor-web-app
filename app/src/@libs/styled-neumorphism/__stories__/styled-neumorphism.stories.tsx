import { concave, convex, flat, pressed } from '@libs/styled-neumorphism';
import React from 'react';
import styled from 'styled-components';

export default {
  title: 'core/Neumorphism',
  argTypes: {
    distance: {
      control: {
        type: 'range',
        min: 0,
        max: 10,
      },
    },
  },
};

interface TemplateProps {
  className?: string;
  distance: number;
}

const Template = styled(({ className }: TemplateProps) => (
  <div className={className}>
    <section className="flat">FLAT</section>
    <section className="concave">CONCAVE</section>
    <section className="convex">CONVEX</section>
    <section className="pressed">PRESSED</section>
  </div>
))`
  display: grid;
  grid-template-columns: repeat(4, 150px);
  grid-gap: 20px;

  section {
    border-radius: 20px;
    padding: 20px;

    text-align: center;
    color: ${({ theme }) => theme.textColor};

    &.flat {
      ${({ theme, distance = 6 }) =>
        flat({
          color: theme.backgroundColor,
          distance,
          intensity: theme.intensity,
        })};
    }

    &.concave {
      ${({ theme, distance = 6 }) =>
        concave({
          color: theme.backgroundColor,
          distance,
          intensity: theme.intensity,
        })};
    }

    &.convex {
      ${({ theme, distance = 6 }) =>
        convex({
          color: theme.backgroundColor,
          distance,
          intensity: theme.intensity,
        })};
    }

    &.pressed {
      ${({ theme, distance = 6 }) =>
        pressed({
          color: theme.backgroundColor,
          distance,
          intensity: theme.intensity,
        })};
    }
  }
`;

export const Functions = (props: TemplateProps) => <Template {...props} />;

Functions.args = { distance: 6 };
Functions.argTypes = {
  distance: {
    control: {
      type: 'range',
      min: 0,
      max: 10,
    },
  },
};
