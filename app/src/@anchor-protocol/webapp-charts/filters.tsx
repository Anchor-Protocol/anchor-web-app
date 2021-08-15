import React from 'react';

export const dropshadowFilter = (
  <filter id="dropshadow" x="-20%" y="-20%" width="200%" height="200%">
    <feDropShadow
      dx="1"
      dy="1"
      stdDeviation="2"
      floodColor="rgba(0, 0, 0, 0.5)"
    />
  </filter>
);
