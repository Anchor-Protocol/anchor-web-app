import React from 'react';

interface SvgDiskProps {
  color: string;
  width: number;
  radius: number;
  transform?: string;
}

export const SvgDisk = ({ color, width, radius, transform }: SvgDiskProps) => (
  <circle
    stroke={color}
    strokeWidth={width}
    fill="transparent"
    r={radius - width / 2}
    cx={radius}
    cy={radius}
    transform={transform}
  />
);
