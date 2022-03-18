export const formatEllapsed = (ms: number): string => {
  return new Date(ms).toISOString().substr(11, 8);
};

export const formatEllapsedSimple = (ms: number): string => {
  return new Date(ms).toISOString().substr(14, 5);
};
