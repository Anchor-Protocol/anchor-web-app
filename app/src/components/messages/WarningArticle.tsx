import { CSSProperties, ReactNode } from 'react';
import styled from 'styled-components';

export interface WarningArticleProps {
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
}

function WarningArticleBase({
  className,
  style,
  children,
}: WarningArticleProps) {
  return (
    <article className={className} style={style}>
      {children}
    </article>
  );
}

export const WarningArticle = styled(WarningArticleBase)`
  border: 1px solid ${({ theme }) => theme.errorTextColor};
  border-radius: 10px;
  color: ${({ theme }) => theme.errorTextColor};
  padding: 10px;
  margin: 20px 0;
  text-align: center;
`;
