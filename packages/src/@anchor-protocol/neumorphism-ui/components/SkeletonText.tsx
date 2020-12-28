import styled, { keyframes } from 'styled-components';

export interface SkeletonTextProps {
  className?: string;
  children: string;
}

function SkeletonTextBase({ className, children }: SkeletonTextProps) {
  return <span className={className}>{children}</span>;
}

const fade = keyframes`
  0% {
    opacity: 0.1;
  }
  
  50% {
    opacity: 0.3;
  }
  
  100% {
    opacity: 0.1;
  }
`;

export const SkeletonText = styled(SkeletonTextBase)`
  user-select: none;
  //color: transparent;
  background-color: currentColor;

  animation: ${fade} 3s infinite;
`;
