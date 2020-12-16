import { concave, convex, flat, pressed } from '@ssen/styled-neumorphism';
import { ActionButton } from 'components/ui/ActionButton';
import { HorizontalRuler } from 'components/ui/HorizontalRuler';
import { Section } from 'components/ui/Section';
import { TextButton } from 'components/ui/TextButton';
import { TextInput } from 'components/ui/TextInput';
import React from 'react';
import styled from 'styled-components';

export interface NeumorphismProps {
  className?: string;
}

function NeumorphismBase({ className }: NeumorphismProps) {
  return (
    <div className={className}>
      <div className="styles">
        <section className="flat">FLAT</section>
        <section className="concave">CONCAVE</section>
        <section className="convex">CONVEX</section>
        <section className="pressed">PRESSED</section>
      </div>

      <Section className="section">
        <TextButton>BUTTON</TextButton>
        <ActionButton>BUTTON</ActionButton>

        <HorizontalRuler />

        <TextInput type="text" />
      </Section>
    </div>
  );
}

export const Neumorphism = styled(NeumorphismBase)`
  background-color: ${({ theme }) => theme.backgroundColor};

  padding: 100px;

  .styles {
    display: flex;

    margin-bottom: 30px;

    section {
      flex: 1;

      &:not(:last-child) {
        margin-right: 30px;
      }

      border-radius: 20px;
      padding: 20px;

      text-align: center;
      color: ${({ theme }) => theme.textColor};

      &.flat {
        ${({ theme }) =>
          flat({
            color: theme.backgroundColor,
            distance: 6,
            intensity: theme.intensity,
          })};
      }

      &.concave {
        ${({ theme }) =>
          concave({
            color: theme.backgroundColor,
            distance: 6,
            intensity: theme.intensity,
          })};
      }

      &.convex {
        ${({ theme }) =>
          convex({
            color: theme.backgroundColor,
            distance: 6,
            intensity: theme.intensity,
          })};
      }

      &.pressed {
        ${({ theme }) =>
          pressed({
            color: theme.backgroundColor,
            distance: 6,
            intensity: theme.intensity,
          })};
      }
    }
  }

  .section {
    margin-bottom: 30px;
    padding: 50px;

    button {
      width: 200px;
      margin-right: 15px;
    }

    hr {
      margin: 30px 0;
    }
  }

  margin-bottom: 1px;
`;
