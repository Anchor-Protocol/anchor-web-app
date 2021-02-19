import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { ReactNode } from 'react';
import styled from 'styled-components';

export interface PollFormLayoutProps {
  className?: string;
  children: ReactNode;
}

function PollFormLayoutBase({ className, children }: PollFormLayoutProps) {
  return <CenteredLayout className={className}>{children}</CenteredLayout>;
}

export const PollFormLayout = styled(PollFormLayoutBase)`
  h1 {
    text-align: center;
    font-size: 27px;
    font-weight: 500;

    margin-bottom: 60px;
  }
`;
