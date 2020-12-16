import {
  concave,
  convex,
  flat,
  horizontalRule,
  pressed,
} from '@ssen/styled-neumorphism';
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

      <hr />

      <button className="text-button">Button</button>
      <button className="color-button">Button</button>

      <hr />

      <input type="text" className="input" />
    </div>
  );
}

const intensity = 0.3;

export const Neumorphism = styled(NeumorphismBase)`
  background-color: #1a1d2e;

  padding: 100px;

  section {
    border-radius: 20px;
    padding: 30px;

    transition: box-shadow 0.1s ease;

    text-align: center;
    color: rgba(255, 255, 255, 0.3);

    &.section-flat {
      ${flat({ color: '#1a1d2e', distance: 6, intensity })};
    }

    &.section-concave {
      ${concave({ color: '#1a1d2e', distance: 6, intensity })};
    }

    &.section-convex {
      ${convex({ color: '#1a1d2e', distance: 6, intensity })};
    }

    &.section-pressed {
      ${pressed({ color: '#1a1d2e', distance: 6, intensity })};
    }
  }

  > section {
    margin-bottom: 30px;
  }

  button {
    outline: none;

    transition: box-shadow 0.1s ease;

    border: 0;
    width: 200px;
    height: 42px;
    border-radius: 21px;
    margin-right: 15px;

    font-family: Gotham;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.39;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;

    &.text-button {
      ${flat({
        color: '#1a1d2e',
        distance: 1,
        intensity,
      })};

      &:hover {
        ${flat({
          color: '#1a1d2e',
          distance: 5,
          intensity,
        })};
      }

      &:active {
        ${concave({
          color: '#1a1d2e',
          distance: 2,
          intensity,
        })};
      }
    }

    &.color-button {
      ${flat({
        color: '#282d46',
        backgroundColor: '#1a1d2e',
        distance: 1,
        intensity,
      })};

      &:hover {
        ${flat({
          color: '#282d46',
          backgroundColor: '#1a1d2e',
          distance: 5,
          intensity,
        })};
      }

      &:active {
        ${concave({
          color: '#282d46',
          backgroundColor: '#1a1d2e',
          distance: 2,
          intensity,
        })};
      }
    }
  }

  hr {
    margin: 30px 0;

    ${horizontalRule({ color: '#1a1d2e', intensity })};
  }

  input {
    outline: none;
    border: 0;
    padding: 20px;
    border-radius: 5px;

    font-family: Gotham;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(255, 255, 255, 0.15);

    ${pressed({
      color: '#181b2b',
      backgroundColor: '#1a1d2e',
      distance: 1,
      intensity: 0.3,
    })};
  }

  margin-bottom: 10px;
`;
