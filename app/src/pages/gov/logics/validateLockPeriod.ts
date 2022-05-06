export const validateLockPeriod = (
  period: number,
  min: number,
  max: number,
) => {
  if (period < min) {
    return `The lock period can not be less than ${min}`;
  }
  if (period > max) {
    return `The lock period can not be more than ${max}`;
  }
  return undefined;
};
