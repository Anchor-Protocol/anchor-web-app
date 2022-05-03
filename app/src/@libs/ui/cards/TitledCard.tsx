import { UIElementProps } from '@libs/ui';
import React from 'react';
import { screen } from 'env';
import styled from 'styled-components';
import { flat } from '@libs/styled-neumorphism';
import { VStack } from '@libs/ui/Stack';

interface TitledCardProps extends UIElementProps {
  title: React.ReactNode;
}

export const TitledCard = ({ children, title, className }: TitledCardProps) => {
  return (
    <Container className={className}>
      <Title>{title}</Title>
      <VStack fullHeight fullWidth>
        {children}
      </VStack>
    </Container>
  );
};

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 30px;
`;

const Container = styled.section`
  padding: 60px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;

  ${({ theme }) =>
    flat({
      color: theme.sectionBackgroundColor,
      backgroundColor: theme.sectionBackgroundColor,
      distance: 1,
      intensity: theme.intensity,
    })};

  @media (max-width: ${screen.tablet.max}px) {
    padding: 30px;
  }

  @media (max-width: ${screen.mobile.max}px) {
    padding: 20px;
  }
`;
