import React from 'react';

interface SvgArcProps {
  color: string;
  width: number;
  radius: number;
  share: number;
  transform?: string;
}

export const toRadians = (degrees: number) => degrees * (Math.PI / 180);

const polarToCartesian = (
  radius: number,
  cutoutRadius: number,
  angleInDegrees: number,
) => {
  const angleInRadians = toRadians(angleInDegrees - 90);
  return {
    x: radius + cutoutRadius * Math.cos(angleInRadians),
    y: radius + cutoutRadius * Math.sin(angleInRadians),
  };
};

const getArcPath = (
  radius: number,
  cutoutRadius: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(radius, radius, endAngle);
  const end = polarToCartesian(radius, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  const start2 = polarToCartesian(radius, cutoutRadius, endAngle);
  const end2 = polarToCartesian(radius, cutoutRadius, startAngle);

  return [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    'L',
    radius,
    radius,
    'Z',

    'M',
    start2.x,
    start2.y,
    'A',
    cutoutRadius,
    cutoutRadius,
    0,
    largeArcFlag,
    0,
    end2.x,
    end2.y,
    'L',
    radius,
    radius,
    'Z',
  ].join(' ');
};

export const SvgArc = ({
  color,
  width,
  radius,
  share,
  transform,
}: SvgArcProps) => {
  const d = getArcPath(radius, radius - width, 0, share * 360);

  return <path transform={transform} fill={color} fillRule="evenodd" d={d} />;
};
