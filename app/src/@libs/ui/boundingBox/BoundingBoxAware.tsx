import React, { ReactNode, useState } from 'react';

import { BoundingBox, useBoundingBox } from './useBoundingBox';

interface BoundingBoxAwareRenderParams {
  boundingBox: BoundingBox | null;
  setElement: (element: HTMLElement | null) => void;
}

interface Props {
  render: (params: BoundingBoxAwareRenderParams) => ReactNode;
}

export const BoundingBoxAware = ({ render }: Props) => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  const boundingBox = useBoundingBox(element);

  return <>{render({ setElement, boundingBox })}</>;
};
