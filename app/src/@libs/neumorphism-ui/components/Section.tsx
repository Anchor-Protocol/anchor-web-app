import { flat } from '@libs/styled-neumorphism';
import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import { getErrorBoundary } from './configErrorBoundary';
import classNames from 'classnames';

interface SectionContentProps {
  className?: string;
  children: ReactNode;
  margin?: 'large' | 'small';
}

const SectionContentBase = (props: SectionContentProps) => {
  const { className, children, margin } = props;

  const ErrorBoundary = getErrorBoundary();

  return (
    <div
      className={classNames('NeuSectionContent', className, {
        'NeuSectionContent-large': margin === 'large',
        'NeuSectionContent-small': margin === 'small',
      })}
    >
      <ErrorBoundary>{children}</ErrorBoundary>
    </div>
  );
};

/**
 * Styled `<section/>` tag
 */
const SectionContent = styled(SectionContentBase)`
  width: 100%;

  &.NeuSectionContent-large {
    padding: 60px;
  }

  &.NeuSectionContent-small {
    padding: 40px;
  }
`;

export interface SectionProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  sectionContentProps?: Omit<SectionContentProps, 'children'>;
}

function SectionBase({
  children,
  className,
  sectionContentProps = { className: 'NeuSection-content' },
  ...sectionProps
}: SectionProps): JSX.Element {
  const content = (
    <SectionContent {...sectionContentProps} children={children} />
  );

  return (
    <section className={`NeuSection-root ${className}`} {...sectionProps}>
      {content}
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
      color: theme.sectionBackgroundColor,
      backgroundColor: theme.sectionBackgroundColor,
      distance: 1,
      intensity: theme.intensity,
    })};

  .NeuSection-content {
    padding: 60px;
  }
`;
