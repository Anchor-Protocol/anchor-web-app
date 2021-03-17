import { HorizontalHeavyRuler } from '@terra-dev/neumorphism-ui/components/HorizontalHeavyRuler';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import styled from 'styled-components';

export interface InterestRateModelSectionProps {
  className?: string;
}

function InterestRateModelSectionBase({
  className,
}: InterestRateModelSectionProps) {
  return (
    <Section className={className}>
      <h2>INTEREST RATE MODEL</h2>

      <HorizontalHeavyRuler />

      <figure></figure>
    </Section>
  );
}

export const InterestRateModelSection = styled(InterestRateModelSectionBase)`
  h2 {
    font-size: 13px;
    font-weight: 500;
    color: #1f1f1f;
  }

  hr {
    margin: 16px 0;
  }

  figure {
    height: 320px;
    border-radius: 20px;
    border: 2px dashed ${({ theme }) => theme.textColor};
  }
`;
