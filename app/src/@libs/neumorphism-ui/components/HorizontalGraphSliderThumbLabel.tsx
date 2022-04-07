import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { UIElementProps } from 'components/layouts/UIElementProps';

interface HorizontalGraphSliderThumbLabelProps extends UIElementProps {
  label: ReactNode;
  position: number;
}

const HorizontalGraphSliderThumbLabelBase = (
  props: HorizontalGraphSliderThumbLabelProps,
) => {
  const { className, label, position } = props;
  return (
    <span className={className} style={{ left: position }}>
      {label}
    </span>
  );
};

export const HorizontalGraphSliderThumbLabel = styled(
  HorizontalGraphSliderThumbLabelBase,
)`
  margin-top: -45px;
  position: relative;
  display: inline-block;

  font-size: 12px;
  font-weight: 500;

  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.positive};
  color: white;
  padding: 5px 8px;

  transform: translateX(-50%);

  user-select: none;

  word-break: keep-all;
  white-space: nowrap;

  &::after {
    content: ' ';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-top: -1px;
    margin-left: -7px;
    border-width: 7px;
    border-style: solid;
    border-color: ${({ theme }) => theme.colors.positive} transparent
      transparent transparent;
  }
`;
