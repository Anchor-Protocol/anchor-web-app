import big, { BigSource } from 'big.js';
import numeral from 'numeral';

// NOTE: this was abstracted from the original implementation, but look to move to a custom package
const formatDecimal = (
  n: BigSource,
  decimals: number,
  delimiter: boolean = true,
): string => {
  const num = big(
    big(n)
      .mul(10 ** decimals)
      .toFixed()
      .split('.')[0],
  )
    .div(10 ** decimals)
    .toFixed();

  if (num === 'NaN') return '';

  const [i, d] = num.split('.');

  const ii = delimiter ? numeral(i).format('0,0') : i;
  const dd = d ? '.' + d : '';

  return (ii === '0' && num[0] === '-' ? '-' : '') + ii + dd;
};

export { formatDecimal };
