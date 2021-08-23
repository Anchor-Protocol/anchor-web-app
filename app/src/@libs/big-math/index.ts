/* eslint-disable @typescript-eslint/no-shadow */
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

export function sum(...numbers: BigSource[]): Big {
  return numbers.reduce((total: Big, num) => {
    return total.add(num);
  }, big(0));
}

export function avg(...numbers: BigSource[]): Big {
  return sum(...numbers).div(numbers.length);
}

export function floor(number: BigSource): Big {
  const fixed = big(number).toFixed();
  const integer = fixed.split('.')[0];
  return integer.length > 0 ? big(integer) : big('0');
}

export function vectorizeAB(
  a: BigSource[] | BigSource,
  b: BigSource[] | BigSource,
): [BigSource[], BigSource[]] {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      throw new Error(`Not equal vector items length of a and b`);
    }
    return [a, b];
  } else if (Array.isArray(a) && !Array.isArray(b)) {
    return [a, Array.from({ length: a.length }, () => b)];
  } else if (!Array.isArray(a) && Array.isArray(b)) {
    return [Array.from({ length: b.length }, () => a), b];
  } else if (!Array.isArray(a) && !Array.isArray(b)) {
    return [[a], [b]];
  } else {
    throw new Error(`Unknown cases a=${a.toString()}, b=${b.toString()}`);
  }
}

export function abs(a: BigSource): Big {
  return big(a).abs();
}

export function exp(a: BigSource): Big {
  return big(Math.pow(Math.E, big(a).toNumber()));
}

export function vectorPlus(
  _a: BigSource[] | BigSource,
  _b: BigSource[] | BigSource,
): Big[] {
  const [a, b] = vectorizeAB(_a, _b);
  return a.map((value, i) => big(value).plus(b[i]));
}

export function vectorMinus(
  _a: BigSource[] | BigSource,
  _b: BigSource[] | BigSource,
): Big[] {
  const [a, b] = vectorizeAB(_a, _b);
  return a.map((value, i) => big(value).minus(b[i]));
}

export function vectorMultiply(
  _a: BigSource[] | BigSource,
  _b: BigSource[] | BigSource,
): Big[] {
  const [a, b] = vectorizeAB(_a, _b);
  return a.map((value, i) => big(value).mul(b[i]));
}

export function vectorDivision(
  _a: BigSource[] | BigSource,
  _b: BigSource[] | BigSource,
): Big[] {
  const [a, b] = vectorizeAB(_a, _b);
  return a.map((value, i) => big(value).div(b[i]));
}

export function vectorDot(
  _a: BigSource[] | BigSource,
  _b: BigSource[] | BigSource,
): Big {
  const [a, b] = vectorizeAB(_a, _b);
  return sum(...vectorMultiply(a, b));
}
