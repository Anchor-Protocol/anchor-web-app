import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
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
    sectionContentProps = { margin: 'large' },
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
`;

export interface CardHeadingProps extends UIElementProps {
  title: string;
}

const CardHeadingBase = (props: CardHeadingProps) => {
  const { className, title } = props;
  return <h2 className={className}>{title}</h2>;
};

export const CardHeading = styled(CardHeadingBase)`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 30px;
`;

export interface CardSubHeadingProps extends CardHeadingProps {
  tooltip?: string;
}

const CardSubHeadingBase = (props: CardSubHeadingProps) => {
  const { className, title, tooltip } = props;

  if (tooltip) {
    return (
      <h2 className={className}>
        <IconSpan>
          {title} <InfoTooltip>{tooltip}</InfoTooltip>
        </IconSpan>
      </h2>
    );
  }

  return <h3 className={className}>{title}</h3>;
};

export const CardSubHeading = styled(CardSubHeadingBase)`
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
`;
