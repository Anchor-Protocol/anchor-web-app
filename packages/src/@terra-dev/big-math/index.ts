import big, { Big, BigSource } from 'big.js';

export function min(...numbers: BigSource[]): Big {
  let minimum: Big = big(numbers[0]);

  let i: number = 0;
  const max: number = numbers.length;
  while (++i < max) {
    if (minimum.gt(numbers[i])) {
      minimum = big(numbers[i]);
    }
  }

  return minimum;
}

export function max(...numbers: BigSource[]): Big {
  let maximum: Big = big(numbers[0]);

  let i: number = 0;
  const max: number = numbers.length;
  while (++i < max) {
    if (maximum.lt(numbers[i])) {
      maximum = big(numbers[i]);
    }
  }

  return maximum;
}

export function floor(number: BigSource): Big {
  const fixed = big(number).toFixed();
  const integer = fixed.split('.')[0];
  return integer.length > 0 ? big(integer) : big('0');
}
