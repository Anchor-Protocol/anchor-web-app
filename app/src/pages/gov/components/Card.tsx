import { Section, SectionProps } from '@libs/neumorphism-ui/components/Section';
import { UIElementProps } from '@libs/ui';
import React, { DOMAttributes } from 'react';
import styled from 'styled-components';

interface CardProps
  extends UIElementProps,
    Pick<SectionProps, 'sectionContentProps'>,
    Pick<DOMAttributes<HTMLButtonElement>, 'onClick'> {}

const CardBase = (props: CardProps) => {
  const {
    className,
    children,
    onClick,
    sectionContentProps = { margin: 'small' },
  } = props;
  return (
    <Section
      className={className}
      sectionContentProps={sectionContentProps}
      onClick={onClick}
    >
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
