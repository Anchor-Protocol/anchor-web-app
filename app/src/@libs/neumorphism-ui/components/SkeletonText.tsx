import React from 'react';
import styled, { keyframes } from 'styled-components';

export interface SkeletonTextProps {
  className?: string;
  children: string;
  backgroundColor?: string;
  highlightColor?: string;
}

function SkeletonTextBase({ className, children }: SkeletonTextProps) {
  return <span className={className}>{children}</span>;
}

const shine = keyframes`
  0% {
    background-position: 0 0, -60px 0;
  }
  
  40%, 100% {
    background-position: 0 0, 600px 0;
  }
`;

export const SkeletonText = styled(SkeletonTextBase)`
  color: transparent;

  background-image: linear-gradient(
      0deg,
      ${({ theme }) => theme.skeleton.backgroundColor},
      ${({ theme }) => theme.skeleton.backgroundColor}
    ),
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0),
      ${({ theme }) => theme.skeleton.lightColor} 50%,
      rgba(255, 255, 255, 0) 80%
    );

  background-repeat: repeat, repeat-y;

  background-size: 100% 100%, 60px 2em;

  background-position: 0 0, 0 0;

  animation: ${shine} 2s cubic-bezier(0.62, 0.01, 0.9, 0.17) infinite;
`;
