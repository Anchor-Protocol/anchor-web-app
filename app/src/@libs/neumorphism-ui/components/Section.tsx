import { flat } from '@libs/styled-neumorphism';
import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { getErrorBoundary } from './configErrorBoundary';

export interface SectionProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}

function SectionBase({ children, className, ...sectionProps }: SectionProps) {
  const ErrorBoundary = getErrorBoundary();

  return (
    <section className={`NeuSection-root ${className}`} {...sectionProps}>
      <div className="NeuSection-content">
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </section>
  );
}

/**
 * Styled `<section/>` tag
 */
export const Section = styled(SectionBase)`
  border-radius: 20px;

  min-width: 0;

  color: ${({ theme }) => theme.textColor};

  ${({ theme }) =>
    flat({
      color: theme.backgroundColor,
      distance: 6,
      intensity: theme.intensity,
    })};

  .NeuSection-content {
    padding: 60px;
  }
`;
