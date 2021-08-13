import { useEffect, useState } from 'react';
import { Point, SpaceRect } from '../types';

export function useCursorPosition(
  targetElement: HTMLElement | SVGSVGElement | null | undefined,
  coordinateSpace: SpaceRect,
): Point | null {
  const [point, setPoint] = useState<Point | null>(null);

  useEffect(() => {
    if (!targetElement) return;

    const el: HTMLElement = targetElement as HTMLElement;

    function move(evt: MouseEvent) {
      const { offsetX, offsetY } = evt;

      if (
        offsetX < coordinateSpace.left ||
        offsetX > coordinateSpace.right ||
        offsetY < coordinateSpace.top ||
        offsetY > coordinateSpace.bottom
      ) {
        setPoint(null);
      } else {
        setPoint({
          x: offsetX - coordinateSpace.left,
          y: offsetY - coordinateSpace.top,
        });
      }
    }

    function leave() {
      setPoint(null);
    }

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);

    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, [
    coordinateSpace.bottom,
    coordinateSpace.left,
    coordinateSpace.right,
    coordinateSpace.top,
    targetElement,
  ]);

  return point;
}
