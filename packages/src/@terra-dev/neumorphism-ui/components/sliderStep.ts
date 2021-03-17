export const sliderStep = (step: number) => (v: number) =>
  v - (v % step) + Math.round((v % step) / step) * step;
