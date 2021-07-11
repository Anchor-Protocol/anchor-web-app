import { CSSProperties, useMemo } from 'react';
import { Gutter, SpaceRect } from '../types';

interface CoordinateSpaceParams {
  width: number;
  height: number;
  margin?: Gutter;
  gutter?: Gutter;
}

export interface CoordinateSpaceComponent {
  margin?: Gutter;
  gutter?: Gutter;
}

export function useCoordinateSpace({
  width,
  height,
  margin = { top: 0, bottom: 0, left: 0, right: 0 },
  gutter = { top: 0, bottom: 0, left: 0, right: 0 },
}: CoordinateSpaceParams): {
  coordinateSpace: SpaceRect;
  canvasStyle: CSSProperties;
} {
  const coordinateSpace = useMemo(() => {
    const w = width + margin.left + margin.right;
    const h = height + margin.top + margin.bottom;

    return {
      x: gutter.left,
      y: gutter.top,
      width: w - gutter.left - gutter.right,
      height: h - gutter.top - gutter.bottom,
      top: gutter.top,
      left: gutter.left,
      right: w - gutter.right,
      bottom: h - gutter.bottom,
    };
  }, [
    gutter.bottom,
    gutter.left,
    gutter.right,
    gutter.top,
    height,
    margin.bottom,
    margin.left,
    margin.right,
    margin.top,
    width,
  ]);

  const canvasStyle = useMemo<CSSProperties>(() => {
    return {
      width: width + margin.left + margin.right,
      height: height + margin.top + margin.bottom,
      marginTop: -margin.top,
      marginLeft: -margin.left,
    };
  }, [height, margin.bottom, margin.left, margin.right, margin.top, width]);

  return { coordinateSpace, canvasStyle };
}
