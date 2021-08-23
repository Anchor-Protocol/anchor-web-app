import React from 'react';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled from 'styled-components';

export interface SectionCoverProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  height: number;
}

function SectionCoverBase({ height, ...divProps }: SectionCoverProps) {
  return <div {...divProps} />;
}

export const SectionCover = styled(SectionCoverBase)`
  height: ${({ height }) => height}px;

  display: grid;
  place-items: center;

  word-break: break-all;
`;
