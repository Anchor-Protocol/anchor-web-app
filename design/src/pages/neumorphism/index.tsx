import { concave, convex, flat, pressed } from '@ssen/styled-neumorphism';
import { backgroundStyle } from 'components/style/dark';
import React from 'react';
import styled from 'styled-components';

export interface NeumorphismProps {
  className?: string;
}

function NeumorphismBase({ className }: NeumorphismProps) {
  return (
    <div className={className}>
      <section className="section-flat">Flat</section>
      <section className="section-concave">Concave</section>
      <section className="section-convex">Convex</section>
      <section className="section-pressed">Pressed</section>
      <button>Hello</button>
    </div>
  );
}

export const Neumorphism = styled(NeumorphismBase)`
  ${backgroundStyle};

  padding: 100px;

  section {
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;

    transition: box-shadow 0.1s ease;

    text-align: center;
    color: rgba(255, 255, 255, 0.3);

    &.section-flat {
      ${flat({ color: '#1a1d2e', distance: 6, intensity: 0.15 })};

      &:hover {
        ${flat({ color: '#1a1d2e', distance: 3, intensity: 0.15 })};
      }

      &:active {
        ${concave({ color: '#1a1d2e', distance: 1, intensity: 0.15 })};
      }
    }

    &.section-concave {
      ${concave({ color: '#1a1d2e', distance: 6, intensity: 0.15 })};
    }

    &.section-convex {
      ${convex({ color: '#1a1d2e', distance: 6, intensity: 0.15 })};
    }

    &.section-pressed {
      ${pressed({ color: '#1a1d2e', distance: 6, intensity: 0.15 })};
    }
  }

  button {
    outline: none;

    transition: box-shadow 0.1s ease;

    border: 0;
    width: 200px;
    height: 42px;
    border-radius: 21px;

    font-family: Gotham;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.39;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;

    ${flat({
      color: '#282d46',
      backgroundColor: '#1a1d2e',
      distance: 1,
      intensity: 0.15,
    })};

    &:hover {
      ${flat({
        color: '#282d46',
        backgroundColor: '#1a1d2e',
        distance: 5,
        intensity: 0.15,
      })};
    }

    &:active {
      ${concave({
        color: '#282d46',
        backgroundColor: '#1a1d2e',
        distance: 2,
        intensity: 0.15,
      })};
    }
  }

  margin-bottom: 10px;
`;
