import { Section, SectionProps } from '@libs/neumorphism-ui/components/Section';
import { UIElementProps } from '@libs/ui';
import React from 'react';
import styled from 'styled-components';

interface CardProps
  extends UIElementProps,
    Pick<SectionProps, 'sectionContentProps'> {}

const CardBase = (props: CardProps) => {
  const {
    className,
    children,
    sectionContentProps = { margin: 'small' },
  } = props;
  return (
    <Section className={className} sectionContentProps={sectionContentProps}>
      {children}
    </Section>
  );
};

export const Card = styled(CardBase)`
  position: relative;

  h2 {
    font-size: 12px;
    font-weight: 500;

    margin-bottom: 10px;
  }
`;
