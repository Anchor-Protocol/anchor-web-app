import { HSLA } from '.';

export const colorToCSSValue = ([h, s, l, a]: HSLA) =>
  `hsla(${h},${s}%,${l}%,${a})`;
